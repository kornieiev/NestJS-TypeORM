import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import CreateArticleDto from './dto/createArticle.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { ArticlesResponseInterface } from './types/articlesResponse.interface';
import { DeleteResult } from 'typeorm';
import UpdateArticleDto from './dto/updateArticle.dto';
import { ArticleEntity } from './article.entity';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  async findAll(
    @User('id') currentUserId: number,
    @Query() query: any,
  ): Promise<ArticlesResponseInterface> {
    return await this.articleService.findAll(currentUserId, query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации входящих данных
  // ValidationPipe выбрасывает исключение BadRequestException, если данные не соответствуют DTO
  async create(
    @User() currentUser: UserEntity, // Используем декоратор User для получения текущего пользователя
    @Body('article') createArticleDto: CreateArticleDto,
  ): Promise<any> {
    console.log('createArticleDto', createArticleDto);
    const article = await this.articleService.createArticle(
      currentUser,
      createArticleDto,
    ); // Здесь можно вернуть созданную статью или сообщение об успешном создании
    return this.articleService.buildArticleResponse(article);
  }

  @Get(':slug')
  @UseGuards(AuthGuard)
  async getArticle(
    @Param('slug') slug: string,
  ): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.findArticleBySlug(slug);
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
  ): Promise<DeleteResult> {
    const response = await this.articleService.deleteArticle(
      slug,
      currentUserId,
    );
    return response;
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации входящих данных
  // ValidationPipe выбрасывает исключение BadRequestException, если данные не соответствуют DTO
  async updateArticle(
    @Param('slug') slug: string,
    @User('id') currentUserId: number,
    @Body('article') updateArticleDto: UpdateArticleDto,
  ): Promise<ArticlesResponseInterface> {
    const article = await this.articleService.updateArticle(
      slug,
      currentUserId,
      updateArticleDto as ArticleEntity,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async addArticleToFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticlesResponseInterface> {
    console.log('currentUserId', currentUserId);
    console.log('slug', slug);

    const article = await this.articleService.addArticleToFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async removeArticleFromFavorites(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ArticlesResponseInterface> {
    console.log('currentUserId - - - @Delete', currentUserId);
    console.log('slug - - - @Delete', slug);

    const article = await this.articleService.removeArticleFromFavorites(
      slug,
      currentUserId,
    );
    return this.articleService.buildArticleResponse(article);
  }
}
