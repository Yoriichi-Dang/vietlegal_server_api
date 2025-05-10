import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';

@Injectable()
export class FindOneRoleUsecase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(id: number) {
    const role = await this.roleRepository.findOne(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  }
}
