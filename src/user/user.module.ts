import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // Сюда добавлять модули, которые нужны для работы этого модуля
  controllers: [UserController], // Сюда добавлять контроллеры, которые будут обрабатывать HTTP запросы
  providers: [UserService, AuthGuard], // Сюда добавлять сервисы, которые будут содержать бизнес-логику
  exports: [UserService], // Сюда добавлять сервисы, которые нужно экспортировать для использования в других модулях
})
export class UserModule {}
