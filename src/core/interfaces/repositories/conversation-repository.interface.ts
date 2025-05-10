import { Conversation } from 'src/core/domain/entities/chat/conversation.entity';
import { Message } from 'src/core/domain/entities/chat/message.entity';
import { CreateConversationDto } from 'src/core/dtos/conversation/create-conversation.dto';
import { CreateMessageDto } from 'src/core/dtos/conversation/create-message.dto';
import { UpdateConversationDto } from 'src/core/dtos/conversation/update-conversation.dto';

export interface IConversationRepository {
  create(
    createConversationDto: CreateConversationDto,
    userId: string,
  ): Promise<Conversation>;
  findAll(userId: string): Promise<Conversation[]>;
  findOne(id: string, userId: string): Promise<Conversation | null>;
  update(
    id: string,
    updateConversationDto: UpdateConversationDto,
    userId: string,
  ): Promise<Conversation | null>;
  remove(id: string, userId: string): Promise<boolean>;
  addMessage(
    conversationId: string,
    createMessageDto: CreateMessageDto,
    userId: string,
  ): Promise<Message>;
  getMessages(conversationId: string, userId: string): Promise<Message[]>;
}
