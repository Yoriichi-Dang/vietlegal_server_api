import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';

@Injectable()
export class RemoveConversationUsecase {
  constructor(
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(id: string, userId: string): Promise<boolean> {
    // Thực hiện xóa conversation
    const result = await this.conversationRepository.remove(id, userId);

    // Nếu không tìm thấy conversation hoặc xóa thất bại
    if (!result) {
      throw new NotFoundException(
        'Conversation not found or cannot be deleted',
      );
    }

    return true;
  }
}
