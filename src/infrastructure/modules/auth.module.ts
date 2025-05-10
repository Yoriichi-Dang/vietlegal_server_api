import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from 'src/presentation/controllers/auth.controller';
import { BcryptUsecase } from 'src/usecases/auth/bcrypt-usecase';
import { HashPasswordUsecase } from 'src/usecases/auth/hash-password-usecase';
import { UserModule } from './user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from 'src/usecases/auth/jwt.service';
import { AuthService } from 'src/usecases/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/presentation/strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/core/domain/entities/user/role.entity';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: HashPasswordUsecase,
      useClass: BcryptUsecase,
    },
    JwtService,
    AuthService,
    JwtStrategy,
  ],
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN') || '1d',
        },
      }),
    }),
  ],
  exports: [HashPasswordUsecase, JwtService, AuthService, PassportModule],
})
export class AuthModule {}
