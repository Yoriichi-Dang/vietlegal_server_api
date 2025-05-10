import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';

@Injectable()
export class RemoveRoleUsecase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number) {
    // Kiểm tra xem role có tồn tại không
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Xóa role
    const result = await this.roleRepository.remove(id);
    if (!result) {
      throw new Error('Failed to remove role');
    }

    return { success: true };
  }
}
