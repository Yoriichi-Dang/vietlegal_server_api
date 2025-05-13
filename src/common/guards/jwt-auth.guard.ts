import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
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

    // Handle different JWT authentication error scenarios
    if (err || !user) {
      // Check if the token is expired
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Token has expired',
          error: 'Unauthorized',
        });
      }

      // Check if no token was provided
      if (info && info.name === 'Error' && info.message === 'No auth token') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'No access token provided',
          error: 'Unauthorized',
        });
      }

      // Handle other JWT related errors
      if (info && info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid token',
          error: 'Unauthorized',
        });
      }

      // Default error handling
      throw (
        err ||
        new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized - Invalid token or authentication required',
          error: 'Unauthorized',
        })
      );
    }
    return user;
  }
}
