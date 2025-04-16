import {
  Injectable,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { IUserRepository } from 'src/core/interfaces/repositories/user-repository.inteface';
import { HashPasswordUsecase } from '../auth/hash-password-usecase';
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject(forwardRef(() => HashPasswordUsecase))
    private readonly hashPasswordUsecase: HashPasswordUsecase,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<UserLogin> {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await this.hashPasswordUsecase.hashPassword(
      createUserDto.password,
    );
    // Create the user
    return this.userRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });
  }
}
