// http://localhost:3000/user
// GET
// Добавить в запрос заголовок Authorization с токеном JWT
// Example: "Token eyJhbGciOiJIUzI1NiIsInR..."

import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable() // Декоратор Injectable позволяет NestJS понять, что этот класс может быть внедрен в другие классы
// Это означает, что мы можем использовать этот middleware в других классах, таких как контроллер
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  // Что бы UserService был доступен в AuthMiddleware, нужно его экспортировать в модуле user.module.ts
  // exports: [UserService], // Это позволит использовать UserService в других модулях, таких как AuthMiddleware
  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    // Здесь проеряется наличие токена в заголовке Authorization
    // Если токен есть, то он проверяется на валидность
    // Если токен валиден, то пользователь устанавливается в запрос в поле req.user = user
    // Если токен не валиден, то пользователь устанавливается как req.user = null
    // Если токен не предоставлен, то пользователь устанавливается как null и вызывается next() с ошибкой 401
    // Если токен валиден, то вызывается next(), чтобы продолжить выполнение запроса
    // Если токен не валиден, то вызывается next() с ошибкой 401

    if (!req.headers.authorization) {
      req.user = null; // Если токен не предоставлен, устанавливаем пользователя как null
      // Можно также вернуть ошибку 401 Unauthorized, если это необходимо
      // res.status(401).json({ message: 'Unauthorized' });
      next();
      return;
    }

    const token = req.headers.authorization.split(' ')[1]; // Извлекаем токен из заголовка Authorization
    // Пример заголовка Authorization
    // Authorization
    // Token eyJhbGciOiJIUzI1NiIsInR...
    // Здесь мы разделяем строку по пробелу и берем второй элемент массива, который содержит сам токен
    // Если токен не предоставлен, то req.headers.authorization.split(' ')[1] будет undefined
    // Поэтому мы проверяем наличие токена перед его использованием

    try {
      const decoded = verify(token, process.env.JWT_SECRET); // Проверяем токен на валидность
      // Здесь можно добавить логику для поиска пользователя в базе данных по decoded.id
      // Например, req.user = await this.userService.findById(decoded.id);
      //   req.user = { id: decoded.id, email: decoded.email }; // Пример установки пользователя

      const user = await this.userService.findById(decoded.id); // Ищем пользователя в базе данных по id из токена
      console.log('user', user);
      req.user = user; // Устанавливаем пользователя в запрос
    } catch (error) {
      console.error('Token verification failed:', error);
      req.user = null; // Если токен недействителен, устанавливаем пользователя как null
      // Можно также вернуть ошибку 401 Unauthorized, если это необходимо
      // res.status(401).json({ message: 'Unauthorized' });
      next();
      return;
    }

    // Если аутентификация успешна, вызываем next()
    next();
  }
}
