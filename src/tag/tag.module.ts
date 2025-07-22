import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // TypeOrmModule - это модуль, который позволяет использовать TypeORM в NestJS
import { TagEntity } from './tag.entity'; // Импортируем TagEntity, чтобы использовать его в TypeOrmModule.forFeature (это метод, который позволяет использовать репозиторий для работы с сущностью TagEntity)

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity])],
  // TypeOrmModule.forFeature регистрирует TagEntity в TypeORM, чтобы мы могли использовать его в TagService
  // forFeature - это метод, который позволяет нам использовать репозиторий для работы с сущностями в рамках этого модуля
  // Он позволяет нам использовать репозиторий для работы с сущностью TagEntity в TagService
  // Это позволяет нам использовать методы репозитория для работы с базой данных, такие как find, save, delete и т.д.
  controllers: [TagController],
  providers: [TagService],
  // другие параметры модуля:
  exports: [TagService], // Экспортируем TagService, чтобы его можно было использовать в других модулях
  // Это позволяет другим модулям использовать TagService для работы с тегами
  // Например, если у нас есть модуль ArticleModule, который использует теги,
  // мы можем импортировать TagModule в ArticleModule и использовать TagService для работы с тегами
  // Это позволяет нам разделить логику работы с тегами и статьями,
  // что делает код более чистым и понятным
  // Также это позволяет нам использовать теги в других модулях, не дублиру
})
export class TagModule {}
