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
    private userDataRepository: Repository<UserData>,
  ) {}
  createUser(createUserDto: CreateUserDto): Promise<UserLogin> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
  findByEmail(email: string): Promise<UserLogin | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
