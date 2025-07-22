import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'mediumclone',
  password: '123',
  database: 'mediumclone',
  synchronize: false, // только для разработки
  //   logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Путь к скомпилированным сущностям, что бы TypeORM мог их найти

  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
};

export default config;
