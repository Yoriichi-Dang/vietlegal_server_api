import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User display name',
    example: 'Nguyen Van A',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
