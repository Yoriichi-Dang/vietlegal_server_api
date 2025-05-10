import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && data.accessToken) {
          // Cấu trúc user đã thay đổi, truy cập trực tiếp vào các thuộc tính
          return {
            user: {
              email: data.user.email,
              name: data.user.name,
              avatarUrl: data.user.avatarUrl,
            },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          };
        }
        return data;
      }),
    );
  }
}
