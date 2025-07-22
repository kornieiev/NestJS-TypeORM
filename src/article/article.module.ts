import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity])], // Сюда добавлять модули, которые нужны для работы этого модуля
  controllers: [ArticleController], // Сюда добавлять контроллеры, которые будут обрабатывать HTTP запросы
  providers: [ArticleService], // Сюда добавлять сервисы, которые будут содержать бизнес-логику
  //   exports: [ArticleService], // Сюда добавлять сервисы, которые нужно экспортировать для использования в других модулях
})
export class ArticleModule {}
