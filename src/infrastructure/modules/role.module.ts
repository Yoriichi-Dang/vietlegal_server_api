import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/core/domain/entities/user/role.entity';
import { RoleController } from 'src/presentation/controllers/role.controller';
import { RoleRepository } from 'src/infrastructure/adapters/repositories/role-repository';
import { CreateRoleUsecase } from 'src/usecases/role/create-role.usecase';
import { FindAllRolesUsecase } from 'src/usecases/role/find-all-roles.usecase';
import { FindOneRoleUsecase } from 'src/usecases/role/find-one-role.usecase';
import { UpdateRoleUsecase } from 'src/usecases/role/update-role.usecase';
import { RemoveRoleUsecase } from 'src/usecases/role/remove-role.usecase';
import { AssignRoleToUserUsecase } from 'src/usecases/role/assign-role-to-user.usecase';
import { UserModule } from './user.module';
import { RoleSeed } from '../seeds/role.seed';

@Module({
  controllers: [RoleController],
  providers: [
    RoleRepository,
    CreateRoleUsecase,
    FindAllRolesUsecase,
    FindOneRoleUsecase,
    UpdateRoleUsecase,
    RemoveRoleUsecase,
    AssignRoleToUserUsecase,
    RoleSeed,
  ],
  imports: [TypeOrmModule.forFeature([Role]), UserModule],
  exports: [
    RoleRepository,
    CreateRoleUsecase,
    FindAllRolesUsecase,
    FindOneRoleUsecase,
    UpdateRoleUsecase,
    RemoveRoleUsecase,
    AssignRoleToUserUsecase,
  ],
})
export class RoleModule {}
