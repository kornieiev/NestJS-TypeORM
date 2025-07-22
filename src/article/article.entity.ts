import { UserEntity } from '@app/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  //

  @BeforeUpdate() // Этот декоратор указывает, что метод будет вызван перед обновлением записи в базе данных
  updateTimestamp() {
    this.updatedAt = new Date(); // Обновляем поле updatedAt перед обновлением записи
  }

  //

  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true }) // eager: true означает, что при загрузке статьи будет автоматически загружаться автор
  // Это нужно для того, чтобы при загрузке статьи сразу получать информацию об авторе статьи
  author: UserEntity;
}
