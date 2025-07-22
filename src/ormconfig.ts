import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  //   logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Путь к скомпилированным сущностям, что бы TypeORM мог их найти
  // этот путь будет использоваться для поиска сущностей как в девелопменте, так и в продакшене

  synchronize: false, // только для разработки
  // Каждый раз при запуске приложения TypeORM будет проверять, есть ли изменения в сущностях и автоматически синхронизировать их с базой данных

  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  //   subscribers: ['dist/subscribers/*.js'],
};

export default config;
