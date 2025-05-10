import { Injectable, Logger } from '@nestjs/common';
import { RoleSeed } from './role.seed';
import { AdminUserSeed } from './admin-user.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly roleSeed: RoleSeed,
    private readonly adminUserSeed: AdminUserSeed,
  ) {}

  /**
   * Khởi tạo dữ liệu mẫu
   */
  async seed() {
    try {
      this.logger.log('Starting seed process...');

      // 1. Tạo vai trò trước
      this.logger.log('Seeding roles...');
      await this.roleSeed.seed();

      // 2. Tạo tài khoản admin
      this.logger.log('Seeding admin user...');
      await this.adminUserSeed.seed();

      this.logger.log('Seed process completed successfully!');
      return true;
    } catch (error) {
      this.logger.error(`Seed process failed: ${error.message}`);
      this.logger.error(error.stack);
      return false;
    }
  }
}
