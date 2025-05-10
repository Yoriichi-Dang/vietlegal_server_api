import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';

@Injectable()
export class FindAllRolesUsecase {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute() {
    return this.roleRepository.findAll();
  }
}
