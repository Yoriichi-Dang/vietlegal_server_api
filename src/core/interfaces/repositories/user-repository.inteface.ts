import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
export interface IUserRepository {
  createUser(createUserDto: CreateUserDto): Promise<UserLogin>;
  findByEmail(email: string): Promise<UserLogin | null>;
}
