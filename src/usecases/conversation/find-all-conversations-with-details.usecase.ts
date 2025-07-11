import { Injectable } from '@nestjs/common';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class FindAllConversationsWithDetailsUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(userId: string) {
    return this.conversationRepository.findAllWithDetails(userId);
  }
}
