import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChangePasswordDto } from 'src/core/dtos/user/change-password.dto';
import { UserRepository } from 'src/infrastructure/adapters/repositories/user-repository';
import { HashPasswordUsecase } from 'src/usecases/auth/hash-password-usecase';

@Injectable()
export class ChangePasswordUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashPasswordUsecase: HashPasswordUsecase,
  ) {}

  async execute(userId: string, changePasswordDto: ChangePasswordDto) {
    // Find the user first to ensure it exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify the current password
    const isCurrentPasswordValid =
      await this.hashPasswordUsecase.comparePassword(
        changePasswordDto.currentPassword,
        user.password,
      );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await this.hashPasswordUsecase.hashPassword(
      changePasswordDto.newPassword,
    );

    // Update the user's password
    await this.userRepository.updateUser(userId, { password: hashedPassword });

    return { message: 'Password changed successfully' };
  }
}
