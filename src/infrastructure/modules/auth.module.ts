import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { BcryptUsecase } from 'src/usecases/auth/bcrypt-usecase';
import { HashPasswordUsecase } from 'src/usecases/auth/hash-password-usecase';
import { UserModule } from './user.module';
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: HashPasswordUsecase,
      useClass: BcryptUsecase,
    },
  ],
  imports: [forwardRef(() => UserModule)],
  exports: [HashPasswordUsecase],
})
export class AuthModule {}
