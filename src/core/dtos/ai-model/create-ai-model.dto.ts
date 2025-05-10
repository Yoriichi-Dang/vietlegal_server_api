import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAIModelDto {
  @ApiProperty({
    description: 'Name of the AI model (unique)',
    example: 'GPT-4',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Provider of the AI model',
    example: 'OpenAI',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  provider: string;

  @ApiProperty({
    description: 'Description of the AI model',
    example: 'Advanced language model by OpenAI',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
