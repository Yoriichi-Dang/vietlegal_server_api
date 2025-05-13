import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateConversationDto } from 'src/core/dtos/conversation/update-conversation.dto';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class UpdateConversationUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(
    id: string,
    updateConversationDto: UpdateConversationDto,
    userId: string,
  ) {
    const updatedConversation = await this.conversationRepository.update(
      id,
      updateConversationDto,
      userId,
    );

    if (!updatedConversation) {
      throw new NotFoundException('Conversation not found');
    }

    return updatedConversation;
  }
}
