import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe, // ValidationPipe используется для валидации входящих данных
  // ValidationPipe позволяет автоматически проверять входящие данные на соответствие DTO
  // ValidationPipe выбрасывает исключение BadRequestException, если данные не соответствуют DTO
  // BadRequestException - это исключение, которое выбрасывается, когда входящие данные не соответствуют ожидаемому формату
  // BadRequestException возвращает статус 400 Bad Request
} from '@nestjs/common';
import { UserService } from './user.service';
import CreateUserDto from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import LoginUserDto from './dto/loginUser.dto';
import { Request } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import UpdateUserDto from './dto/updateUser.dto';

@Controller() // тут может быть указан основной путь, по которому будет доступен этот контроллер
// Например, если у вас есть базовый URL http://localhost:3000, то этот контроллер будет доступен по адресу http://localhost:3000/users
// Например, такой контроллер будет обрабатывать HTTP запросы, связанные с пользователями
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации входящих данных
  async createUser(
    @Body('user') createUserDTO: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDTO);
    return this.userService.buildUserResponse(user);
  }

  @Post('users/login') // Этот метод будет обрабатывать HTTP POST запросы на адрес /users/login
  @UsePipes(new ValidationPipe()) // Используем ValidationPipe для валидации входящих данных
  async login(
    @Body('user') loginUserDto: LoginUserDto, // DTO для логина пользователя
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto); // Логика для логина пользователя

    const result = this.userService.buildUserResponse(user); // Формируем ответ для пользователя

    return result;
  }

  @Get('user') // Этот метод будет обрабатывать HTTP GET запросы на адрес /user
  @UseGuards(AuthGuard) // Используем AuthGuard для проверки авторизации пользователя
  // AuthGuard - это guard, который проверяет, авторизован ли пользователь
  // Если пользователь авторизован, то он продолжит выполнение метода
  // Если пользователь не авторизован, то будет выброшено исключение UnauthorizedException заложенное в логике AuthGuard
  // UnauthorizedException возвращает статус 401 Unauthorized
  async currentUser(
    // @Req() request: ExpressRequestInterface,
    @User() user: UserEntity, // Используем декоратор User для получения текущего пользователя
    @User('id') currentUserId: number,
  ): Promise<UserResponseInterface> {
    console.log('user from @User():', user); // current UserEntity
    console.log('currentUserId from @User("id")', currentUserId); // currentUserId
    // Этот метод будет возвращать текущего пользователя
    // Например, если пользователь авторизован, то он будет возвращать данные текущего пользователя
    // Если пользователь не авторизован, то он будет возвращать ошибку 401 Unauthorized
    // console.log('request.user', request.user);
    // if (!request.user) {
    //   throw new NotFoundException('User not found');
    // }
    // return this.userService.buildUserResponse(request.user);
    return this.userService.buildUserResponse(user);
  }

  @Put('user') // HTTP PUT запросы обычно используются для обновления данных
  @UseGuards(AuthGuard) // Используем AuthGuard для проверки авторизации пользователя
  @UsePipes(new ValidationPipe()) // Добавляем валидацию
  async updateCurrentUser(
    @Body('user') updateUserDto: UpdateUserDto, // DTO для обновления пользователя
    @User('id') currentUserId: number, // Получаем ID текущего пользователя из декоратора User
  ): Promise<UserResponseInterface> {
    // Этот метод будет обновлять данные текущего пользователя
    // Например, если пользователь авторизован, то он будет обновлять данные текущего пользователя
    // Если пользователь не авторизован, то он будет возвращать ошибку 401 Unauthorized
    const user = await this.userService.updateUser(
      // Вызываем метод updateUser из UserService
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user); // Формируем ответ для пользователя
  }
}
