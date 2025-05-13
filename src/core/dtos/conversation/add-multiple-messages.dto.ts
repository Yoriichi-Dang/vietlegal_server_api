import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';

export class AddMultipleMessagesDto {
  @ApiProperty({
    description: 'Array of messages to add to the conversation',
    type: [CreateMessageDto],
    examples: {
      messages: {
        value: [
          {
            content: 'Hello, this is message 1',
            sender_type: 'user',
          },
          {
            content: 'This is message 2 from a model',
            sender_type: 'model',
            model_id: 1,
          },
        ],
      },
    },
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMessageDto)
  @IsNotEmpty()
  messages: CreateMessageDto[];
}
