import { Injectable } from '@nestjs/common';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { IUserRepository } from 'src/core/interfaces/repositories/user-repository.inteface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserLogin)
    private readonly userRepository: Repository<UserLogin>,
    @InjectRepository(UserData)
    private readonly userDataRepository: Repository<UserData>,
  ) {}

  async createUser(
    createUserDto: CreateUserDto | UserLogin,
  ): Promise<UserLogin> {
    if (createUserDto instanceof UserLogin) {
      return this.userRepository.save(createUserDto);
    }
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserLogin | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['userData'],
    });
  }

  async findById(id: string): Promise<UserLogin | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['userData'],
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
      relations: ['userData'],
    });
  }

  async updateUser(
    id: string,
    userData: Partial<UserLogin>,
  ): Promise<UserLogin> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }
}
