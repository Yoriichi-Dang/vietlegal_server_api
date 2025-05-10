import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAIModelDto {
  @ApiProperty({
    description: 'Name of the AI model (unique)',
    example: 'GPT-4',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Provider of the AI model',
    example: 'OpenAI',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  provider?: string;

  @ApiProperty({
    description: 'Description of the AI model',
    example: 'Advanced language model by OpenAI',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
