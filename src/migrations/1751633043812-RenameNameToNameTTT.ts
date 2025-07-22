import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNameToNameTTT1751633043812 implements MigrationInterface {
    name = 'RenameNameToNameTTT1751633043812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name" TO "nameTTT"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "nameTTT" TO "name"`);
    }

}
