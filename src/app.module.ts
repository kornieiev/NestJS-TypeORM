import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@app/ormconfig';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './user/middleware/auth.midleware';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TagModule,
    UserModule,
    ArticleModule,
  ], // В этой строке мы указываем для нашего app.module зависимость TypeOrmModule.
  // forRoot - это метод, который инициализирует TypeORM с конфигурацией, которую мы передаем.
  // ormconfig - это объект, который содержит настройки подключения к базе данных.
  // Он импортируется из файла ormconfig.ts, который мы создали ранее.
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // Этот модуль является корневым модулем приложения.
  // Он импортирует другие модули, такие как TagModule и UserModule, которые содержат логику для работы с тегами и пользователями соответственно.
  // Также он импортирует TypeOrmModule для работы с базой данных.
  // Контроллеры и провайдеры определены в этом модуле, что позволяет NestJS управлять зависимостями и маршрутизацией.
  configure(consumer: MiddlewareConsumer) {
    // Здесь можно добавить middleware, если это необходимо
    // Например, consumer.apply(AuthMiddleware).forRoutes(UserController);
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*', // Применяем AuthMiddleware ко всем маршрутам
      method: RequestMethod.ALL, // Применяем ко всем методам (GET, POST, PUT, DELETE и т.д.)
    }); // Применяем AuthMiddleware ко всем маршрутам
    // Это означает, что AuthMiddleware будет вызываться для всех входящих запросов.
    // Если нужно применить middleware только к определенным маршрутам, можно указать их в forRoutes.
  }
}

// В class AppModule добавляется метод configure, который позволяет настроить middleware для приложения.
// В данном случае мы применяем AuthMiddleware ко всем маршрутам приложения.
// Это означает, что AuthMiddleware будет вызываться для всех входящих запросов.
// Если нужно применить middleware только к определенным маршрутам, можно указать их в forRoutes.
// Например, можно указать только для маршрутов, связанных с пользователями, или только для определенных HTTP методов (GET, POST и т.д.).
// В данном случае мы применяем AuthMiddleware ко всем маршрутам, что позволяет проверять авторизацию пользователя для всех запросов к приложению
// и устанавливать пользователя в запросе, если токен валиден.
// Если токен не валиден, то пользователь будет установлен как null, и можно будет обработать это в контроллерах или сервисах, проверяя наличие пользователя в запросе.
// Это позволяет централизованно обрабатывать авторизацию и доступ к защищенным ресурсам приложения.
// Таким образом, мы можем использовать AuthMiddleware для проверки авторизации пользователя и установки пользователя в запрос
// для дальнейшей обработки в контроллерах и сервисах приложения.
