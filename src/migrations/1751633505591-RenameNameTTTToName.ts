import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameNameTTTToName1751633505591 implements MigrationInterface {
    name = 'RenameNameTTTToName1751633505591'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "nameTTT" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name" TO "nameTTT"`);
    }

}
