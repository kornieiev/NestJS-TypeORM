import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
  // readonly - это означает, что это свойство доступно только для чтения
  @IsEmail() // Декоратор для валидации, проверяет, что строка является корректным email
  @IsNotEmpty() // Декоратор для валидации, проверяет, что поле не пустое
  readonly email: string;
  @IsNotEmpty() // Декоратор для валидации, проверяет, что поле не пустое
  readonly password: string;
  @IsNotEmpty() // Декоратор для валидации, проверяет, что поле не пустое
  readonly username: string;
  readonly bio?: string; // ? - это означает, что это свойство является необязательным
  readonly image?: string; // ? - это означает, что это свойство является необязательным
}
