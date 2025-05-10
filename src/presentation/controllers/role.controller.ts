import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from 'src/core/dtos/role/create-role.dto';
import { UpdateRoleDto } from 'src/core/dtos/role/update-role.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { RoleType } from 'src/core/domain/entities/user/role.entity';
import { CreateRoleUsecase } from 'src/usecases/role/create-role.usecase';
import { FindAllRolesUsecase } from 'src/usecases/role/find-all-roles.usecase';
import { FindOneRoleUsecase } from 'src/usecases/role/find-one-role.usecase';
import { UpdateRoleUsecase } from 'src/usecases/role/update-role.usecase';
import { RemoveRoleUsecase } from 'src/usecases/role/remove-role.usecase';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { AssignRoleToUserUsecase } from 'src/usecases/role/assign-role-to-user.usecase';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
export class RoleController {
  constructor(
    private readonly createRoleUsecase: CreateRoleUsecase,
    private readonly findAllRolesUsecase: FindAllRolesUsecase,
    private readonly findOneRoleUsecase: FindOneRoleUsecase,
    private readonly updateRoleUsecase: UpdateRoleUsecase,
    private readonly removeRoleUsecase: RemoveRoleUsecase,
    private readonly assignRoleToUserUsecase: AssignRoleToUserUsecase,
  ) {}

  @Post()
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
  })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.createRoleUsecase.execute(createRoleDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'Return all roles.',
  })
  async findAll() {
    try {
      return await this.findAllRolesUsecase.execute();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve roles',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get a specific role by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the role.',
  })
  async findOne(@Param('id') id: string) {
    try {
      return await this.findOneRoleUsecase.execute(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Role not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
  })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    try {
      return await this.updateRoleUsecase.execute(+id, updateRoleDto);
    } catch (error) {
      if (error.message === 'Role not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to update role',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    try {
      return await this.removeRoleUsecase.execute(+id);
    } catch (error) {
      if (error.message === 'Role not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to delete role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('assign/:userId/:roleId')
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({
    status: 200,
    description: 'The role has been successfully assigned to the user.',
  })
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    try {
      return await this.assignRoleToUserUsecase.execute(userId, +roleId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to assign role to user',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
