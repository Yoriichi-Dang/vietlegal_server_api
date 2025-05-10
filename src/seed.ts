import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { RoleSeed } from './infrastructure/seeds/role.seed';
import { AdminUserSeed } from './infrastructure/seeds/admin-user.seed';

async function bootstrap() {
  const logger = new Logger('Seed');
  logger.log('Starting seed process...');

  try {
    // Tạo app với tùy chọn bỏ qua xác thực môi trường
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log'],
    });

    // Lấy các service seed từ container
    const roleSeed = app.get(RoleSeed);
    const adminUserSeed = app.get(AdminUserSeed);

    // Chạy các seed theo thứ tự
    logger.log('Seeding roles...');
    await roleSeed.seed();

    logger.log('Seeding admin user...');
    await adminUserSeed.seed();

    logger.log('Seed process completed successfully!');

    await app.close();
  } catch (error) {
    logger.error(`Seed process failed: ${error.message}`);
    logger.error(error.stack);
  }
}

bootstrap();
