import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from '../adapters/repositories/user-repository';
import { CreateUserUseCase } from 'src/usecases/user/create-user-usecase';
import { AuthModule } from './auth.module';
import { Role } from 'src/core/domain/entities/user/role.entity';
import { AdminUserSeed } from '../seeds/admin-user.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, UserLogin, Role]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    // Register repository
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepository,

    // Register use cases
    CreateUserUseCase,

    // Seed
    AdminUserSeed,
  ],
  exports: ['IUserRepository', CreateUserUseCase, UserRepository],
})
export class UserModule {}
