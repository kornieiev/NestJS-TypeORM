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
      `INSERT INTO users (email, bio, image, password, username) VALUES
      ('lola@mail.com', 'Bio for Lola', 'image_url', '${password}', 'lola'),
      ('leo@mail.com', 'Bio for Leo', 'image_url', '${password}', 'leo')`,
    );
  }

  public async down(): Promise<void> {}
}
