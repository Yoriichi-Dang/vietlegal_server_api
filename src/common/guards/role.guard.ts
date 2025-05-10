import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/has-roles.decorator';
import { RoleType } from 'src/core/domain/entities/user/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly logger = new Logger(RoleGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Nếu route không yêu cầu vai trò cụ thể thì cho phép truy cập
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      this.logger.warn('User information not found in request');
      return false; // Nếu không có thông tin người dùng, không cho phép
    }

    // Debug để xem thông tin user
    this.logger.debug(`User info: ${JSON.stringify(user)}`);

    // Kiểm tra xem role có tồn tại không
    if (!user.role) {
      this.logger.warn(`User ${user.email} has no role assigned`);
      return requiredRoles.includes(RoleType.USER); // Nếu không có role, chỉ cho phép truy cập các route USER
    }

    return requiredRoles.some((role) => user.role.name === role);
  }
}
