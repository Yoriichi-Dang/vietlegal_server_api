import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/infrastructure/adapters/repositories/user-repository';

@Injectable()
export class GetProfileUsecase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string) {
    // Find the user first to ensure it exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Return user profile data
    return {
      id: user.id,
      email: user.email,
      name: user.userData?.name,
      avatarUrl: user.userData?.avatarUrl,
      role: user.role?.name,
    };
  }
}
