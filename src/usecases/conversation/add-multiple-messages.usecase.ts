import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from 'src/core/dtos/conversation/create-message.dto';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class AddMultipleMessagesUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(
    conversationId: string,
    createMessageDtos: CreateMessageDto[],
    userId: string,
  ) {
    return this.conversationRepository.addMultipleMessages(
      conversationId,
      createMessageDtos,
      userId,
    );
  }
}
