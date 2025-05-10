import { Injectable } from '@nestjs/common';
import { UpdateRoleDto } from 'src/core/dtos/role/update-role.dto';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';

@Injectable()
export class UpdateRoleUsecase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number, updateRoleDto: UpdateRoleDto) {
    // Kiểm tra xem role có tồn tại không
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new Error('Role not found');
    }

    // Nếu cập nhật tên, kiểm tra xem tên đã tồn tại chưa
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findByName(
        updateRoleDto.name,
      );
      if (existingRole) {
        throw new Error(
          `Role with name '${updateRoleDto.name}' already exists`,
        );
      }
    }

    return this.roleRepository.update(id, updateRoleDto);
  }
}
