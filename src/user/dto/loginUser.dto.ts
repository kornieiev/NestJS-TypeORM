import { IsEmail, IsNotEmpty } from 'class-validator';

export default class LoginUserDto {
  // readonly - это означает, что это свойство доступно только для чтения
  @IsEmail() // Декоратор для валидации, проверяет, что строка является корректным email
  @IsNotEmpty() // Декоратор для валидации, проверяет, что поле не пустое
  readonly email: string;
  @IsNotEmpty() // Декоратор для валидации, проверяет, что поле не пустое
  readonly password: string;
}
