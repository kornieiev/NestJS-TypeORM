import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import {
  CanActivate, // CanActivate - это интерфейс, который позволяет создавать guards в NestJS
  ExecutionContext, // ExecutionContext - это интерфейс, который предоставляет контекст выполнения запроса
  // ExecutionContext позволяет получить доступ к объекту запроса, ответу и другим данным,
  // связанным с выполнением запроса
  // Он используется в guards для проверки авторизации пользователя
  // Guards - это классы, которые позволяют контролировать доступ к обработчикам запросов
  // Они могут использоваться для проверки авторизации, аутентификации, валидации и других задач
  // Guards могут быть применены к контроллерам, методам или глобально ко всему приложению
  // Если guard возвращает true, то запрос продолжает выполняться,
  // если false, то запрос прерывается и возвращается ошибка
  // Например, если guard проверяет, авторизован ли пользователь,
  // и пользователь не авторизован, то guard вернет false и запрос не будет обработан
  HttpException, // HttpException - это базовый класс для всех HTTP исключений в NestJS
  // Он позволяет выбрасывать исключения с определенным статусом и сообщением
  // Например, HttpException может быть использован для выбрасывания исключения 404 NotFound,
  // 400 Bad Request и других
  HttpStatus, // HttpStatus - это перечисление, которое содержит все возможные HTTP статусы
  // Оно используется для указания статуса ответа при выбрасывании исключений
  Injectable, // Injectable - это декоратор, который позволяет NestJS понять, что этот класс может быть внедрен в другие классы
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // Здесь пишется логика проверки авторизации
    // Например, проверка токена или сессии пользователя

    const request = context
      .switchToHttp()
      .getRequest<ExpressRequestInterface>();

    if (request.user) {
      return true; // Возвращаем true, если пользователь авторизован, иначе false
    }

    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED); // Если пользователь не авторизован, выбрасываем исключение Unauthorized
  }
}
