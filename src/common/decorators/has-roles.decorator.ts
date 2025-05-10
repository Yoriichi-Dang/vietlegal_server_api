import { SetMetadata } from '@nestjs/common';
import { RoleType } from 'src/core/domain/entities/user/role.entity';

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
