import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from 'src/core/dtos/user/update-profile.dto';
import { UserRepository } from 'src/infrastructure/adapters/repositories/user-repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';

@Injectable()
export class UpdateProfileUsecase {
  private readonly logger = new Logger(UpdateProfileUsecase.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(UserData)
    private readonly userDataRepository: Repository<UserData>,
  ) {}

  async execute(userId: string, updateProfileDto: UpdateProfileDto) {
    // Find the user first to ensure it exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user's data entity
    if (!user.userData) {
      throw new Error('User data record not found');
    }

    this.logger.log(
      `Updating profile for user ${userId} with data: ${JSON.stringify(updateProfileDto)}`,
    );
    this.logger.log(`Original user data: ${JSON.stringify(user.userData)}`);

    // Create update data object
    const updateData = {};

    if (updateProfileDto.name !== undefined) {
      updateData['name'] = updateProfileDto.name;
    }

    if (updateProfileDto.avatarUrl !== undefined) {
      updateData['avatarUrl'] = updateProfileDto.avatarUrl;
    }

    // Direct update to the database
    await this.userDataRepository.update(user.userData.id, updateData);

    this.logger.log(
      `Directly updated user data with ID ${user.userData.id} with: ${JSON.stringify(updateData)}`,
    );

    // Get the updated user with fresh data
    const updatedUser = await this.userRepository.findById(userId);

    this.logger.log(
      `Updated profile: ${JSON.stringify(updatedUser?.userData)}`,
    );

    // Return updated user data
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.userData?.name,
      avatarUrl: updatedUser.userData?.avatarUrl,
      role: updatedUser.role?.name,
    };
  }
}
