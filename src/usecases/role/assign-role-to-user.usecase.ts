import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';
import { UserRepository } from 'src/infrastructure/adapters/repositories/user-repository';

@Injectable()
export class AssignRoleToUserUsecase {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string, roleId: number) {
    // Kiểm tra người dùng
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Kiểm tra vai trò
    const role = await this.roleRepository.findOne(roleId);
    if (!role) {
      throw new Error('Role not found');
    }

    // Gán vai trò cho người dùng
    user.role_id = roleId;
    const updatedUser = await this.userRepository.updateUser(userId, {
      role_id: roleId,
    });

    return {
      user: updatedUser,
      role: role,
    };
  }
}
