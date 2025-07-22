// https://www.udemy.com/course/nestjs-writing-api-for-the-real-project-from-scratch/learn/lecture/26686756#questions/18863042
// Этот файл содержит конфигурацию для начальной загрузки данных в базу данных
// Он используется для создания начальных данных, таких как теги, пользователи и статьи

import ormconfig from './ormconfig';

const ormseedconfig = {
  ...ormconfig,
  migrations: ['src/seeds/*.ts'], // Путь к миграциям для начальной загрузки данных
};

export default ormseedconfig;
