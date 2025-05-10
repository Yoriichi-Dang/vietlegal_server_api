import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto';

enum SenderType {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how can I help you?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Type of the sender',
    enum: SenderType,
    example: 'user',
  })
  @IsEnum(SenderType)
  @IsNotEmpty()
  sender_type: string;

  @ApiProperty({
    description: 'AI Model ID - required when sender_type is "model"',
    example: 1,
    required: false,
  })
  @ValidateIf((o) => o.sender_type === 'model')
  @IsNumber()
  @IsNotEmpty()
  model_id?: number;

  @ApiProperty({
    description: 'Type of the message',
    example: 'text',
    default: 'text',
  })
  @IsString()
  @IsOptional()
  message_type?: string = 'text';

  @ApiProperty({
    description: 'Attachments for the message',
    type: [CreateAttachmentDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttachmentDto)
  @IsOptional()
  attachments?: CreateAttachmentDto[];
}
