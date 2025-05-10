import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from 'src/core/domain/entities/user/role.entity';

@Injectable()
export class RoleSeed implements OnModuleInit {
  private readonly logger = new Logger(RoleSeed.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing roles seed...');
    await this.seed();
    this.logger.log('Roles seed completed');
  }

  async seed() {
    const count = await this.roleRepository.count();
    if (count > 0) {
      this.logger.log('Roles already exist, skipping seed');
      return;
    }

    const roles = [
      {
        name: RoleType.ADMIN,
        description: 'Administrator with full system access',
      },
      {
        name: RoleType.USER,
        description: 'Regular user with basic access',
      },
    ];

    for (const role of roles) {
      await this.roleRepository.save(this.roleRepository.create(role));
      this.logger.log(`Created role: ${role.name}`);
    }
  }
}
