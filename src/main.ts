if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

// Загружаем переменные окружения
dotenv.config();

// Используем переменную окружения для порта
const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}
bootstrap();
