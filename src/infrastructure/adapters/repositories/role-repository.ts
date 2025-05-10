import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleType } from 'src/core/domain/entities/user/role.entity';
import { CreateRoleDto } from 'src/core/dtos/role/create-role.dto';
import { UpdateRoleDto } from 'src/core/dtos/role/update-role.dto';
import { IRoleRepository } from 'src/core/interfaces/repositories/role-repository.interface';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async findByName(name: RoleType): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null> {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      return null;
    }

    await this.roleRepository.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    try {
      // Kiểm tra xem vai trò này có phải là vai trò mặc định (user) không
      const role = await this.roleRepository.findOne({
        where: { id },
      });

      if (!role) {
        return false;
      }

      if (role.name === RoleType.USER) {
        throw new Error('Cannot delete the default user role');
      }

      const result = await this.roleRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      console.error('Error removing role:', error);
      return false;
    }
  }

  async getDefaultRole(): Promise<Role> {
    let defaultRole = await this.findByName(RoleType.USER);

    if (!defaultRole) {
      // Tạo vai trò mặc định nếu chưa tồn tại
      const createRoleDto = {
        name: RoleType.USER,
        description: 'Default user role with basic access',
      };
      defaultRole = await this.create(createRoleDto);
    }

    return defaultRole;
  }
}
