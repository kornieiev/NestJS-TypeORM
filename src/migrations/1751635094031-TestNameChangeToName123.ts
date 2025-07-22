import { MigrationInterface, QueryRunner } from "typeorm";

export class TestNameChangeToName1231751635094031 implements MigrationInterface {
    name = 'TestNameChangeToName1231751635094031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name" TO "name123"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" RENAME COLUMN "name123" TO "name"`);
    }

}
