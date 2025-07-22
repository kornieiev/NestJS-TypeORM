export default class UpdateUserDto {
  // readonly - это означает, что это свойство доступно только для чтения
  readonly username?: string;
  readonly email?: string;
  readonly bio?: string;
  readonly image?: string; // ? - это означает, что это свойство является необязательным
}
