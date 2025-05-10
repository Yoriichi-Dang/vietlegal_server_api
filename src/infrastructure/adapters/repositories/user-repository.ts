import { Injectable, Logger } from '@nestjs/common';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { IUserRepository } from 'src/core/interfaces/repositories/user-repository.inteface';
import { Role, RoleType } from 'src/core/domain/entities/user/role.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserLogin)
    private readonly userRepository: Repository<UserLogin>,
    @InjectRepository(UserData)
    private readonly userDataRepository: Repository<UserData>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto | UserLogin,
  ): Promise<UserLogin> {
    if (createUserDto instanceof UserLogin) {
      return this.userRepository.save(createUserDto);
    }
    const user = this.userRepository.create(createUserDto);

    // Thêm vai trò mặc định cho người dùng mới
    const defaultRole = await this.getDefaultRole();
    if (defaultRole) {
      user.role_id = defaultRole.id;
    }

    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserLogin | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userData', 'role'],
    });
  }

  async findById(id: string): Promise<UserLogin | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userData', 'role'],
    });
  }

  async findByProvider(
    provider: string,
    providerAccountId: string,
  ): Promise<UserLogin | null> {
    return this.userRepository.findOne({
      where: {
        provider,
        providerAccountId,
      },
      relations: ['userData', 'role'],
    });
  }

  async updateUser(
    id: string,
    userData: Partial<UserLogin>,
  ): Promise<UserLogin> {
    this.logger.log(
      `Updating user with ID: ${id}, data: ${JSON.stringify(userData)}`,
    );
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async updateUserData(userData: UserData): Promise<UserData> {
    this.logger.log(
      `Updating user data with ID: ${userData.id}, name: ${userData.name}`,
    );

    try {
      const result = await this.userDataRepository.save(userData);
      this.logger.log(
        `User data updated successfully: ${JSON.stringify(result)}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating user data: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getDefaultRole(): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name: RoleType.USER },
    });
  }
}
