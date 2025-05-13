import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModel } from 'src/core/domain/entities/chat/ai_model.entity';
import { Attachment } from 'src/core/domain/entities/chat/attachment.entity';
import { Conversation } from 'src/core/domain/entities/chat/conversation.entity';
import { Message } from 'src/core/domain/entities/chat/message.entity';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { ConversationController } from 'src/presentation/controllers/conversation.controller';
import { ConversationRepository } from 'src/infrastructure/adapters/repositories/conversation-repository';
import { CreateConversationUsecase } from 'src/usecases/conversation/create-conversation.usecase';
import { FindAllConversationsUsecase } from 'src/usecases/conversation/find-all-conversations.usecase';
import { AddMessageUsecase } from 'src/usecases/conversation/add-message.usecase';
import { GetMessagesUsecase } from 'src/usecases/conversation/get-messages.usecase';
import { UpdateConversationUsecase } from 'src/usecases/conversation/update-conversation.usecase';
import { AuthModule } from './auth.module';

@Module({
  controllers: [ConversationController],
  providers: [
    ConversationRepository,
    CreateConversationUsecase,
    FindAllConversationsUsecase,
    AddMessageUsecase,
    GetMessagesUsecase,
    UpdateConversationUsecase,
  ],
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      Message,
      Attachment,
      AIModel,
      UserLogin,
    ]),
    AuthModule,
  ],
  exports: [
    ConversationRepository,
    CreateConversationUsecase,
    FindAllConversationsUsecase,
    AddMessageUsecase,
    GetMessagesUsecase,
    UpdateConversationUsecase,
  ],
})
export class ConversationModule {}
