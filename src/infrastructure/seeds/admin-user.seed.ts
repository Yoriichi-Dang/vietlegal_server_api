import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { Role, RoleType } from 'src/core/domain/entities/user/role.entity';
import { HashPasswordUsecase } from 'src/usecases/auth/hash-password-usecase';

@Injectable()
export class AdminUserSeed implements OnModuleInit {
  private readonly logger = new Logger(AdminUserSeed.name);

  constructor(
    @InjectRepository(UserLogin)
    private readonly userRepository: Repository<UserLogin>,
    @InjectRepository(UserData)
    private readonly userDataRepository: Repository<UserData>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly hashPasswordUsecase: HashPasswordUsecase,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing admin user seed...');
    await this.seed();
    this.logger.log('Admin user seed completed');
  }

  async seed() {
    // Kiểm tra xem đã có tài khoản admin chưa
    const existingAdmin = await this.userRepository.findOne({
      where: { email: 'admin@vietlegal.com' },
    });

    if (existingAdmin) {
      this.logger.log('Admin account already exists, skipping seed');
      return;
    }

    // Lấy admin role từ database
    const adminRole = await this.roleRepository.findOne({
      where: { name: RoleType.ADMIN },
    });

    if (!adminRole) {
      this.logger.error('Admin role not found, cannot create admin user');
      return;
    }

    // Tạo dữ liệu người dùng
    const userData = this.userDataRepository.create({
      name: 'System Admin',
      avatarUrl: null,
    });

    // Tạo mật khẩu đã hash
    const hashedPassword =
      await this.hashPasswordUsecase.hashPassword('Admin@123');

    // Tạo tài khoản admin
    const adminUser = this.userRepository.create({
      email: 'admin@vietlegal.com',
      password: hashedPassword,
      emailVerified: true,
      role_id: adminRole.id,
      userData: userData,
    });

    // Lưu vào database
    await this.userRepository.save(adminUser);

    this.logger.log(
      'Created admin user: admin@vietlegal.com with password: Admin@123',
    );
  }
}
