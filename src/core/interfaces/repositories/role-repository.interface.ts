import { Role, RoleType } from 'src/core/domain/entities/user/role.entity';
import { CreateRoleDto } from 'src/core/dtos/role/create-role.dto';
import { UpdateRoleDto } from 'src/core/dtos/role/update-role.dto';

export interface IRoleRepository {
  findAll(): Promise<Role[]>;
  findOne(id: number): Promise<Role | null>;
  findByName(name: RoleType): Promise<Role | null>;
  create(createRoleDto: CreateRoleDto): Promise<Role>;
  update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role | null>;
  remove(id: number): Promise<boolean>;
  getDefaultRole(): Promise<Role>;
}
