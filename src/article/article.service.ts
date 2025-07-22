import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleEntity } from './article.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import CreateArticleDto from './dto/createArticle.dto';
import { UserEntity } from '@app/user/user.entity';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import slugify from 'slugify';
import { randomUUID } from 'crypto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async findAll(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author'); // Для каждого поста получаем автора
    // .leftJoinAndSelect('articles.favoritedBy', 'favoritedBy'); // Для каждого поста получаем пользователей, которые его лайкнули

    queryBuilder.orderBy('articles.createdAt', 'DESC'); // Сортируем статьи по дате создания

    const articlesCount = await queryBuilder.getCount(); // Вернет количество статей в базе данных

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      if (author) {
        queryBuilder.andWhere('articles.authorId = :id', {
          id: author.id,
        });
      }
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    if (query.favorited) {
      console.log('FAVORITED!!!');

      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'], // Загружаем статьи, которые пользователь лайкнул
      });

      const ids = author?.favorites.map((el) => el.id) || []; // Получаем массив ID статей, которые пользователь лайкнул или пустой массив, если пользователь не найден

      if (ids.length > 0) {
        // Если пользователь найден и у него есть избранные статьи, то добавляем условие
        // Проверяем, что у каждого поста есть ID в избранных статьях пользователя
        // Это условие будет проверять, что ID статьи есть в массиве избранных
        // Если пользователь не найден, то ids будет пустым массивом и условие не будет применено
        // Это нужно для того, чтобы получить статьи, которые лайкнул пользователь
        // Если пользователь не найден, то условие не будет применено и вернутся все статьи
        // Если пользователь найден, то вернутся только статьи, которые лайкнул пользователь
        queryBuilder.andWhere('articles.id IN (:...ids)', { ids }); // Проверяем у каждого поста, есть ли он в избранном у пользователя
        // ...ids - это синтаксис TypeORM для передачи массива параметров в запрос. По типу contains
      } else {
        queryBuilder.andWhere('1 = 0'); // Если пользователь не найден, то вернем пустой результат
        // Если не использовать это условие, то вернутся все статьи, которые лайкнул пользователь
        // Это условие всегда будет ложным, и вернет пустой массив статей
        // Это нужно для того, чтобы не возвращать статьи, если пользователь не найден
        // Если пользователь не найден, то вернутся все статьи, которые лайкнул пользователь
      }
    }

    if (query.limit) {
      queryBuilder.limit(query.limit); // Ограничиваем количество статей
    }

    if (query.offset) {
      queryBuilder.offset(query.offset); // Устанавливаем смещение для пагинации
    }

    let favoriteIds: number[] = [];

    if (currentUserId) {
      const currentUser = await this.userRepository.findOne({
        where: { id: currentUserId },
        relations: ['favorites'], // Загружаем статьи, которые пользователь лайкнул
      });
      favoriteIds = currentUser?.favorites.map((el) => el.id) || []; // Получаем массив ID статей, которые пользователь лайкнул или пустой массив, если пользователь не найден
    }

    const articles = await queryBuilder.getMany(); // Вернет массив статей или пустой массив

    const articlesWithFavorites = articles.map((article) => {
      const isFavorited = favoriteIds.includes(article.id); // Проверяем, есть ли статья в избранном у текущего пользователя
      return {
        ...article,
        isFavorited, // Добавляем поле isFavorited в статью
      };
    });

    return {
      articles: articlesWithFavorites,
      articlesCount,
    };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto); // Копируем свойства из DTO в сущность

    if (!article.tagList) {
      article.tagList = []; // Если tagList не передан, инициализируем его пустым массивом
    }

    article.slug = this.getSlug(createArticleDto.title); // Устанавливаем слаг статьи

    article.author = currentUser; // Устанавливаем автора статьи

    return await this.articleRepository.save(article);
  }

  async findArticleBySlug(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      // relations: ['author'], // Загружаем автора статьи
    });

    if (!article) {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    // Если статья не найдена, выбрасываем исключение HttpException с кодом 404 Not Found

    return article;
  }

  async deleteArticle(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticleBySlug(slug);

    // Проверяем, что текущий пользователь является автором статьи
    if (!article.author || article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    const result = await this.articleRepository.delete({ slug });

    return result;
  }

  async updateArticle(
    slug: string,
    currentUserId: number,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    // Получаем статью по slug
    const article = await this.findArticleBySlug(slug);

    // Проверяем, что текущий пользователь является автором статьи
    if (!article.author || article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    // Обновляем поля статьи
    Object.assign(article, updateArticleDto);

    // Если изменился заголовок, обновляем slug
    if (updateArticleDto.title) {
      article.slug = this.getSlug(updateArticleDto.title);
    }

    // Если tagList не передан, оставляем существующий
    if (!updateArticleDto.tagList) {
      // Оставляем существующий tagList
    } else {
      article.tagList = updateArticleDto.tagList;
    }

    return await this.articleRepository.save(article);
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findArticleBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'], // Загружаем статьи, которые пользователь лайкнул
    });
    console.log('user', user);

    const isNotFavorited =
      user?.favorites.findIndex(
        (articleInFavorites) => articleInFavorites.id === article.id,
      ) === -1;

    if (isNotFavorited) {
      user.favorites.push(article); // Добавляем статью в избранное
      article.favoritesCount += 1; // Увеличиваем счетчик лайков статьи
      await this.userRepository.save(user); // Сохраняем пользователя с обновленным списком избранных статей
      await this.articleRepository.save(article); // Сохраняем статью с обновленным счетчиком лайков
    }

    return article;
  }

  async removeArticleFromFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    console.log('1 - slug', slug);
    console.log('1 - currentUserId', currentUserId);

    const article = await this.findArticleBySlug(slug);
    console.log('2 - article', article);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'], // Загружаем статьи, которые пользователь лайкнул
    });
    console.log('3 - user = = = = = removeArticleFromFavorites', user);

    const articleIndex = user?.favorites.findIndex(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    console.log('???   ???   articleIndex', articleIndex);

    if (typeof articleIndex === 'number' && articleIndex >= 0 && user) {
      console.log('!+!+!+!+!+!+!+!');
      user.favorites.splice(articleIndex, 1); // Удаляем статью из избранного
      article.favoritesCount -= 1; // Уменьшаем счетчик лайков статьи
      await this.userRepository.save(user); // Сохраняем пользователя с обновленным списком избранных статей
      await this.articleRepository.save(article); // Сохраняем статью с обновленным счетчиком лайков
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticlesResponseInterface {
    return {
      articles: [article],
      articlesCount: 1,
    };
  }

  private getSlug(title: string): string {
    return slugify(title, { lower: true }) + '-' + randomUUID().slice(0, 8);
  }
}
