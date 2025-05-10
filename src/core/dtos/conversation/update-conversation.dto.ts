import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConversationDto {
  @ApiProperty({
    description: 'The title of the conversation',
    example: 'Updated Conversation Title',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Whether the conversation is archived',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_archived?: boolean;
}
