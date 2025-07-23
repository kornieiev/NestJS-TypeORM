import { MigrationInterface, QueryRunner } from 'typeorm';
import { hash } from 'bcrypt';

export class SeedDb1751630834781 implements MigrationInterface {
  name = 'SeedDb1751630834781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons-seed'), ('coffee-seed'), ('nestjs-seed')`,
    );
    const password = await hash('password', 7);

    await queryRunner.query(
      `
      INSERT INTO users (username, email, password) VALUES
      ('user', 'user@mail.com', '${password}')
      `,
    );

    // 3. Получаем реальные ID созданных пользователей
    const users = await queryRunner.query(
      `SELECT id, email FROM users WHERE email IN ('user@mail.com', 'user2@mail.com') ORDER BY email`,
    );

    const userId = users.find((u) => u.email === 'user@mail.com')?.id;

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES
      ('article-one', 'Article one', 'Description for article one', 'Body for article one', 'tag-1,tag-2', ${userId})`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES
      ('article-two', 'Article two', 'Description for article two', 'Body for article two', 'tag-3,tag-4', ${userId})`,
    );
  }

  public async down(): Promise<void> {}
}
