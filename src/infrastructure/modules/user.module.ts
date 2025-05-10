import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from '../adapters/repositories/user-repository';
import { CreateUserUseCase } from 'src/usecases/user/create-user-usecase';
import { AuthModule } from './auth.module';
import { Role } from 'src/core/domain/entities/user/role.entity';
import { AdminUserSeed } from '../seeds/admin-user.seed';
import { UserController } from 'src/presentation/controllers/user.controller';
import { GetProfileUsecase } from 'src/usecases/user/get-profile.usecase';
import { UpdateProfileUsecase } from 'src/usecases/user/update-profile.usecase';
import { ChangePasswordUsecase } from 'src/usecases/user/change-password.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, UserLogin, Role]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    // Register repository
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    UserRepository,

    // Register use cases
    CreateUserUseCase,
    GetProfileUsecase,
    UpdateProfileUsecase,
    ChangePasswordUsecase,

    // Seed
    AdminUserSeed,
  ],
  exports: ['IUserRepository', CreateUserUseCase, UserRepository],
})
export class UserModule {}
