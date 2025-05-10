import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Patch,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UpdateProfileDto } from 'src/core/dtos/user/update-profile.dto';
import { ChangePasswordDto } from 'src/core/dtos/user/change-password.dto';
import { UpdateProfileUsecase } from 'src/usecases/user/update-profile.usecase';
import { ChangePasswordUsecase } from 'src/usecases/user/change-password.usecase';
import { GetProfileUsecase } from 'src/usecases/user/get-profile.usecase';
import { ProfileResponseDto } from 'src/core/dtos/user/profile-response.dto';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly updateProfileUsecase: UpdateProfileUsecase,
    private readonly changePasswordUsecase: ChangePasswordUsecase,
    private readonly getProfileUsecase: GetProfileUsecase,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req) {
    try {
      const userId = req.user.sub;
      this.logger.log(`Getting profile for user: ${userId}`);
      return await this.getProfileUsecase.execute(userId);
    } catch (error) {
      this.logger.error(`Error getting profile: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Failed to retrieve profile',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: ProfileResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    try {
      const userId = req.user.sub;
      const result = await this.updateProfileUsecase.execute(
        userId,
        updateProfileDto,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error updating profile: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message || 'Failed to update profile',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({
    status: 200,
    description: 'Password changed successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Current password is incorrect',
  })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const userId = req.user.sub;
      this.logger.log(`Changing password for user: ${userId}`);
      return await this.changePasswordUsecase.execute(
        userId,
        changePasswordDto,
      );
    } catch (error) {
      this.logger.error(
        `Error changing password: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message || 'Failed to change password',
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
