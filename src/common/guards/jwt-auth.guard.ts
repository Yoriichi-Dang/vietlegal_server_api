import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Thêm xử lý bổ sung ở đây nếu cần
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // Improved logging to debug authentication issues
    if (info) {
      console.log('JWT Auth Info:', info.message);
      console.log('JWT Auth Error Details:', info);
    }

    if (err) {
      console.log('JWT Auth Error:', err);
    }

    if (!user) {
      console.log('User not found in request');
    } else {
      console.log(
        'User authenticated:',
        user.email,
        'with role:',
        user.role?.name,
      );
    }

    // You can throw an exception based on 'info' or 'err' content
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Unauthorized - Invalid token or authentication required',
        )
      );
    }
    return user;
  }
}
