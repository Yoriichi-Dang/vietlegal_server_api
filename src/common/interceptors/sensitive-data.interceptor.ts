import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SensitiveDataInterceptor implements NestInterceptor {
  // Danh sách các trường nhạy cảm cần loại bỏ
  private sensitiveFields = [
    'password',
    'idToken',
    'resetPasswordToken',
    'verificationToken',
    'provider',
    'providerAccountId',
    'resetPasswordTokenExpired',
    'tokenExpired',
  ];

  // Các trường sẽ được giữ lại của đối tượng user
  private allowedUserFields = [
    'email',
    'username',
    'name',
    'avatarUrl',
    'role_id',
    'role',
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Xử lý dữ liệu trước khi trả về
        if (data) {
          return this.filterSensitiveData(data);
        }
        return data;
      }),
    );
  }

  private filterSensitiveData(data: any): any {
    // Nếu là mảng, xử lý từng phần tử
    if (Array.isArray(data)) {
      return data.map((item) => this.filterSensitiveData(item));
    }

    // Nếu là object, lọc các thuộc tính nhạy cảm
    if (
      data &&
      typeof data === 'object' &&
      !Buffer.isBuffer(data) &&
      !(data instanceof Date)
    ) {
      const filtered = { ...data };

      // Xử lý đối tượng user
      if (filtered.user) {
        const userData = {};

        // Chỉ lấy các trường được phép
        for (const field of this.allowedUserFields) {
          if (filtered.user[field] !== undefined) {
            userData[field] = filtered.user[field];
          }
        }

        // Đảm bảo thông tin role được bảo toàn
        if (filtered.user.role) {
          userData['role'] = filtered.user.role;
        }

        // Lưu user_id riêng nếu cần
        filtered.user_id = filtered.user.id;

        // Thay thế toàn bộ đối tượng user bằng phiên bản đã lọc
        // Tùy chọn: có thể xóa hoàn toàn với delete filtered.user
        filtered.user = userData;
      }

      // Xóa tất cả các trường nhạy cảm được định nghĩa
      for (const field of this.sensitiveFields) {
        delete filtered[field];
      }

      // Xử lý đệ quy các thuộc tính còn lại
      for (const key in filtered) {
        if (filtered[key] && typeof filtered[key] === 'object') {
          filtered[key] = this.filterSensitiveData(filtered[key]);
        }
      }

      return filtered;
    }

    return data;
  }
}
