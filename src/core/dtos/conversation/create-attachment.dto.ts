import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({
    description: 'Path of the file',
    example: '/uploads/files/document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  file_path: string;

  @ApiProperty({
    description: 'Name of the file',
    example: 'document.pdf',
  })
  @IsString()
  @IsNotEmpty()
  file_name: string;

  @ApiProperty({
    description: 'Type of the file',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  file_type: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024,
  })
  @IsNumber()
  @IsNotEmpty()
  file_size: number;

  @ApiProperty({
    description: 'Content hash of the file',
    example: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    required: false,
  })
  @IsString()
  @IsOptional()
  content_hash?: string;
}
