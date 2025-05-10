import { Injectable } from '@nestjs/common';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class GetMessagesUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(conversationId: string, userId: string) {
    return this.conversationRepository.getMessages(conversationId, userId);
  }
}
