import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { sign } from 'jsonwebtoken';
import { UserResponseInterface } from './types/userResponse.interface';
import LoginUserDto from './dto/loginUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import { compare } from 'bcrypt';

@Injectable() // Декоратор Injectable позволяет NestJS понять, что этот класс может быть внедрен в другие классы
// Это означает, что мы можем использовать этот сервис в других классах, таких как контроллер
export class UserService {
  constructor(
    @InjectRepository(UserEntity) // Используем декоратор InjectRepository для внедрения репозитория UserEntity
    private readonly userRepository: Repository<UserEntity>, // Репозиторий UserEntity позволяет нам взаимодействовать с таблицей пользователей в базе данных
    // Репозиторий - это абстракция над базой данных, которая позволяет нам выполнять CRUD операции
    // CRUD - это аббревиатура от Create, Read, Update, Delete
    // Репозиторий предоставляет методы для работы с сущностями, такие как find, save, delete и т.д.
    // Репозиторий UserEntity позволяет нам выполнять операции с таблицей пользователей в базе данных
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // Сначала проверяем, существует ли пользователь с таким email

    // Используем метод findOne из репозитория userRepository для поиска пользователя по email
    // Этот метод вернет пользователя, если он существует, или null, если не существует
    const userByEmail = await this.userRepository.findOne({
      // findOne ищет уникальную запись в базе данных
      // findOne принимает объект с условиями поиска
      // В данном случае мы ищем пользователя по полю email
      where: { email: createUserDto.email },
    });

    const userByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (userByEmail || userByUsername) {
      // Если пользователь с таким email уже существует, то выбрасываем исключение NotFoundException
      // Это нужно для того, чтобы не допустить создание пользователя с уже существующим email
      // Возвращаем ошибку 404 Not Found с сообщением "Пользователь с таким email уже существует"
      throw new HttpException( // HttpException позволяет выбрасывать HTTP ошибки с определенным статусом и сообщением
        'Пользователь с таким email или именем уже существует',
        HttpStatus.UNPROCESSABLE_ENTITY, // UNPROCESSABLE_ENTITY (422) - это статус, который используется, когда запрос не может быть обработан из-за ошибок в данных
      );
    }

    // Если пользователь с таким email не существует, то продолжаем создание пользователя

    // Метод для создания пользователя
    // Этот метод будет использоваться для создания нового пользователя в базе данных
    // Он будет принимать объект CreateUserDto, который содержит данные пользователя
    // Возвращаем Promise, который будет содержать созданного пользователя
    // Используем метод save из репозитория userRepository для сохранения нового пользователя в базе данных
    // Этот метод будет автоматически вызывать хук BeforeInsert, который хеширует пароль
    // Если хук BeforeInsert не сработает, то пароль не будет хеширован
    // Поэтому важно, чтобы хук BeforeInsert был правильно настроен в сущности UserEntity
    // Если хук сработает, то пароль будет хеширован перед сохранением пользователя
    // Возвращаем созданного пользователя, который будет содержать хешированный пароль
    // Важно: если вы используете хук BeforeInsert, то нужно создавать экземпляр UserEntity
    // и присваивать ему значения из createUserDto, а не сохранять
    // сам объект createUserDto напрямую в репозиторий, иначе хук может не сработать
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    const newUserData = await this.userRepository.save(newUser);
    return newUserData;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
    // Метод для логина пользователя
    const { email, password } = loginUserDto;

    const userByEmail = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password', 'bio', 'image'], // Выбираем только нужные поля, чтобы не возвращать лишние данные
    });

    // select используется для выбора определенных полей из базы данных
    // Это нужно потому что в UserEntity есть поле password, у которого есть декоратор @Column({ select: false }),
    // который указывает, что это поле не должно возвращаться при запросах к базе данных
    // Поэтому мы явно указываем, что нам нужно поле password, чтобы проверить пароль пользователя

    let isPasswordCorrect = false; // Переменная для проверки правильности пароля

    // Если пользователь с таким email существует, то проверяем пароль
    // Используем метод compare из библиотеки bcrypt для сравнения введенного пароля с хешированным паролем
    // Этот метод принимает два аргумента: введенный пароль и хешированный пароль из базы данных
    // Если пароли совпадают, то isPasswordCorrect будет true, иначе false
    // Если пользователь не найден или пароль неверный, то выбрасываем исключение HttpException
    // с сообщением "Пользователь не найден или неверный пароль" и статусом UNAUTHORIZED (401)
    // Это нужно для того, чтобы не допустить авторизацию пользователя с неверным паролем
    // Возвращаем пользователя, если пароль верный
    if (userByEmail && userByEmail.password) {
      isPasswordCorrect = await compare(password, userByEmail.password);
    }

    // Если пароль неверный, то выбрасываем исключение HttpException с сообщением "Пользователь не найден или неверный пароль" и статусом UNAUTHORIZED (401)
    if (!userByEmail || !isPasswordCorrect) {
      throw new HttpException(
        'Пользователь не найден или неверный пароль',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return userByEmail; // Возвращаем пользователя, если пароль верный
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { id },
      // select: ['id', 'username', 'email', 'bio', 'image'], // Выбираем только нужные поля, чтобы не возвращать лишние данные
    });
  }

  async updateUser(
    currentUserId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    // Метод для обновления пользователя
    // Этот метод будет использоваться для обновления данных текущего пользователя
    // Он будет принимать id текущего пользователя и данные для обновления

    // Находим пользователя по ID
    const user = await this.findById(currentUserId);

    console.log('user=>updateUser', user);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Обновляем поля пользователя
    Object.assign(user, updateUserDto);

    // Сохраняем обновленного пользователя
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    // Метод для генерации JWT токена
    // Этот метод будет использоваться для генерации JWT токена для пользователя
    // Он будет принимать объект пользователя и возвращать JWT токен
    // JWT токен будет содержать id, username и email пользователя
    // Это нужно для того, чтобы пользователь мог авторизоваться и получать доступ к защищенным ресурсам
    // Используем метод sign из библиотеки jsonwebtoken для генерации токена
    // Он принимает объект с данными пользователя и секретный ключ, который хранится в .env файле
    // Возвращаем сгенерированный токен
    // Этот токен будет использоваться для авторизации пользователя в приложении
    // Важно: не храните секретный ключ в коде, используйте переменные окружения (.env файл)
    // Это нужно для того, чтобы не допустить утечку секретного ключа
    // Секретный ключ должен быть длинным и сложным, чтобы обеспечить безопасность токена
    return sign(
      // sign принимает два аргумента: объект с данными пользователя и секретный ключ
      // Объект с данными пользователя, который будет закодирован в токен
      // эти данные будут доступны на стороне клиента после авторизации
      // и могут быть использованы для идентификации пользователя путем декодирования токена
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET, // секретный ключ сохнаренный в .env файле
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    // Метод для формирования ответа пользователя
    // Этот метод будет использоваться для формирования ответа пользователя после создания или авторизации
    // Он будет возвращать объект с полями пользователя и токеном JWT
    // Это нужно для того, чтобы не возвращать пароль и другие чувствительные данные

    // Исключаем пароль из ответа с помощью деструктуризации
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    // Возвращаем объект с полем user, который содержит данные пользователя без пароля и токен JWT
    return {
      user: {
        ...userWithoutPassword,
        token: this.generateJwt(user),
      },
    };
  }
}
