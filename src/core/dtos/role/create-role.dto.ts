import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleType } from 'src/core/domain/entities/user/role.entity';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name (admin/user)',
    enum: RoleType,
    example: 'admin',
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  name: RoleType;

  @ApiProperty({
    description: 'Role description',
    example: 'Administrator with full access',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
