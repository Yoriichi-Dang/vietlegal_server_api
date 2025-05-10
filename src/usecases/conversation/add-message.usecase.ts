import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from 'src/core/dtos/conversation/create-message.dto';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class AddMessageUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(
    conversationId: string,
    createMessageDto: CreateMessageDto,
    userId: string,
  ) {
    const result = await this.conversationRepository.addMessage(
      conversationId,
      createMessageDto,
      userId,
    );

    return result;
  }
}
