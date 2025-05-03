import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';

export interface IUserRepository {
  createUser(user: UserLogin | CreateUserDto): Promise<UserLogin>;
  findByEmail(email: string): Promise<UserLogin | null>;
  findById(id: string): Promise<UserLogin | null>;
  findByProvider(
    provider: string,
    providerAccountId: string,
  ): Promise<UserLogin | null>;
  updateUser(id: string, userData: Partial<UserLogin>): Promise<UserLogin>;
}
