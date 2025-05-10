import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/infrastructure/adapters/repositories/user-repository';
import { RoleType } from 'src/core/domain/entities/user/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      // Lấy thông tin người dùng từ database để có thông tin vai trò mới nhất
      const user = await this.userRepository.findById(payload.sub);

      if (!user) {
        this.logger.warn(`User with ID ${payload.sub} not found in database`);
        return {
          sub: payload.sub,
          email: payload.email,
          role: { name: RoleType.USER }, // Gán vai trò mặc định
        };
      }

      // Nếu không có thông tin role, gán vai trò mặc định
      if (!user.role) {
        this.logger.warn(
          `User ${user.email} has no role assigned, using default`,
        );
        return {
          sub: user.id,
          email: user.email,
          role: { name: RoleType.USER },
        };
      }

      this.logger.debug(
        `User ${user.email} authenticated with role: ${user.role.name}`,
      );

      // Trả về thông tin từ token, phù hợp với payload của token
      return {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      this.logger.error(`Error validating token: ${error.message}`);
      // Trả về thông tin user tối thiểu với quyền mặc định
      return {
        sub: payload.sub,
        email: payload.email,
        role: { name: RoleType.USER },
      };
    }
  }
}
