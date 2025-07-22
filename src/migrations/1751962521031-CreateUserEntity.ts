import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserEntity1751962521031 implements MigrationInterface {
    name = 'CreateUserEntity1751962521031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name123" TO "name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name" TO "name123"`);
    }

}
