import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from 'src/core/dtos/role/create-role.dto';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';

@Injectable()
export class CreateRoleUsecase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(createRoleDto: CreateRoleDto) {
    // Kiểm tra xem role đã tồn tại chưa
    const existingRole = await this.roleRepository.findByName(
      createRoleDto.name,
    );
    if (existingRole) {
      throw new Error(`Role with name '${createRoleDto.name}' already exists`);
    }

    return this.roleRepository.create(createRoleDto);
  }
}
