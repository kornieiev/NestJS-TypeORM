import { config as dotenvConfig } from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
// Загружаем переменные окружения в начале файла
dotenvConfig();

console.log('first', process.env.DB_HOST);

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === 'true',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

export default config;
