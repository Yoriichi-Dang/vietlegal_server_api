import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UserRepository } from '../adapters/repositories/user-repository';
import { CreateUserUseCase } from 'src/usecases/user/create-user-usecase';
import { AuthModule } from './auth.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserData, UserLogin]),
    forwardRef(() => AuthModule),
  ],
  providers: [
    // Register repository
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },

    // Register use cases
    CreateUserUseCase,
  ],
  exports: ['IUserRepository', CreateUserUseCase],
})
export class UserModule {}
