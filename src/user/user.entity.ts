import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { ArticleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  @Column({ select: false }) // Поле password не будет возвращаться при запросах к базе данных
  // Это нужно для того, чтобы не возвращать пароль в ответах API
  // Это нужно для того, чтобы не допустить утечку пароля
  // Если нужно будет получить пароль, то нужно будет явно указать, что это поле нужно
  // Например, при использовании метода findOne() можно указать, что нужно вернуть поле password
  // Но это не рекомендуется делать, так как пароль должен храниться в зашифрованном виде
  // и не должен быть доступен в открытом виде
  password: string;

  @Column({ default: '' })
  username: string;

  //

  @BeforeInsert() // Этот декоратор указывает, что метод hashPassword будет вызван перед вставкой новой записи в базу данных
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  //

  // Связь один-ко-многим с сущностью ArticleEntity
  // Это означает, что один пользователь может иметь много статей
  // Связь будет установлена по полю author в сущности ArticleEntity
  // Это нужно для того, чтобы можно было получить все статьи пользователя
  // Например, при использовании метода find() можно получить все статьи пользователя
  // Если нужно будет получить статьи пользователя, то можно использовать метод find() с условием
  // where: { authorId: this.id }
  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  //

  // Связь многие-ко-многим с сущностью ArticleEntity
  // Это означает, что один пользователь может лайкнуть много статей, и одна статья может быть лайкнута многими пользователями
  // Связь будет установлена по полю favorites в сущности UserEntity
  // Это нужно для того, чтобы можно было получить все статьи, которые лайкнул пользователь
  // Например, при использовании метода find() можно получить все статьи, которые лайкнул пользователь
  // Если нужно будет получить статьи, которые лайкнул пользователь, то можно использовать метод find() с условием
  // where: { favorites: { id: this.id } }
  // https://www.udemy.com/course/nestjs-writing-api-for-the-real-project-from-scratch/learn/lecture/26686526#questions/17223030
  //
  @ManyToMany(() => ArticleEntity)
  @JoinTable() // Этот декоратор указывает, что связь многие-ко-многим будет храниться в отдельной таблице
  // Эта таблица будет содержать id пользователя и id статьи, которые лайкнул пользователь
  favorites: ArticleEntity[]; // Это поле будет содержать статьи, которые лайкнул пользователь
}
