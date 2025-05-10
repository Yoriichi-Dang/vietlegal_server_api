import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '7c0caa38-36d6-4a56-8c3f-c7f815c6fd1b',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User display name',
    example: 'Nguyen Van A',
    nullable: true,
  })
  name: string;

  @ApiProperty({
    description: 'URL to user avatar image',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  avatarUrl: string;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    nullable: true,
  })
  role: string;
}
