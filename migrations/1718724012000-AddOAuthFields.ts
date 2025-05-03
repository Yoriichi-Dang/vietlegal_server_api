import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOAuthFields1718724012000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users_login
      ADD COLUMN provider VARCHAR(255),
      ADD COLUMN provider_account_id VARCHAR(255),
      ADD COLUMN refresh_token TEXT,
      ADD COLUMN access_token TEXT,
      ADD COLUMN token_type VARCHAR(255),
      ADD COLUMN id_token TEXT,
      ADD COLUMN expires_at BIGINT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users_login
      DROP COLUMN provider,
      DROP COLUMN provider_account_id,
      DROP COLUMN refresh_token,
      DROP COLUMN access_token,
      DROP COLUMN token_type,
      DROP COLUMN id_token,
      DROP COLUMN expires_at
    `);
  }
}
