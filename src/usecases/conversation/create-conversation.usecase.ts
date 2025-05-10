import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from 'src/core/dtos/conversation/create-conversation.dto';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class CreateConversationUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(createConversationDto: CreateConversationDto, userId: string) {
    const conversation = await this.conversationRepository.create(
      createConversationDto,
      userId,
    );
    return conversation;
  }
}
