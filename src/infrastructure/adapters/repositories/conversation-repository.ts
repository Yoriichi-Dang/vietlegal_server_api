import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from 'src/core/domain/entities/chat/conversation.entity';
import { Message } from 'src/core/domain/entities/chat/message.entity';
import { Attachment } from 'src/core/domain/entities/chat/attachment.entity';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { CreateConversationDto } from 'src/core/dtos/conversation/create-conversation.dto';
import { UpdateConversationDto } from 'src/core/dtos/conversation/update-conversation.dto';
import { CreateMessageDto } from 'src/core/dtos/conversation/create-message.dto';
import { IConversationRepository } from 'src/core/interfaces/repositories/conversation-repository.interface';

@Injectable()
export class ConversationRepository implements IConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(UserLogin)
    private readonly userRepository: Repository<UserLogin>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(
    createConversationDto: CreateConversationDto,
    userId: string,
  ): Promise<Conversation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const conversation = this.conversationRepository.create({
      ...createConversationDto,
      user,
    });

    return this.conversationRepository.save(conversation);
  }

  async findAll(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { user: { id: userId } },
      order: { updated_at: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['messages', 'messages.attachments', 'messages.model'],
      order: { messages: { created_at: 'ASC' } },
    });
  }

  async update(
    id: string,
    updateConversationDto: UpdateConversationDto,
    userId: string,
  ): Promise<Conversation | null> {
    const conversation = await this.conversationRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!conversation) {
      return null;
    }

    await this.conversationRepository.update(
      { id, user: { id: userId } },
      updateConversationDto,
    );

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    try {
      // Kiểm tra xem cuộc hội thoại có tồn tại và thuộc về user không
      const conversation = await this.conversationRepository.findOne({
        where: { id, user: { id: userId } },
        relations: ['messages', 'messages.attachments'],
      });

      if (!conversation) {
        return false;
      }

      // Thiết lập transaction để đảm bảo tính toàn vẹn dữ liệu
      const queryRunner =
        this.conversationRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // 1. Xóa tất cả attachments trước
        if (conversation.messages && conversation.messages.length > 0) {
          for (const message of conversation.messages) {
            if (message.attachments && message.attachments.length > 0) {
              await queryRunner.manager.delete(Attachment, {
                message: { id: message.id },
              });
            }
          }
        }

        // 2. Xóa tất cả messages
        await queryRunner.manager.delete(Message, {
          conversation: { id },
        });

        // 3. Cuối cùng xóa conversation
        await queryRunner.manager.delete(Conversation, {
          id,
          user: { id: userId },
        });

        // Commit transaction
        await queryRunner.commitTransaction();
        return true;
      } catch (err) {
        // Rollback transaction nếu có lỗi
        await queryRunner.rollbackTransaction();
        console.error('Transaction error while removing conversation:', err);
        return false;
      } finally {
        // Giải phóng query runner
        await queryRunner.release();
      }
    } catch (error) {
      console.error('Error removing conversation:', error);
      return false;
    }
  }

  async addMessage(
    conversationId: string,
    createMessageDto: CreateMessageDto,
    userId: string,
  ): Promise<Message> {
    // Sử dụng truy vấn đơn giản để kiểm tra sự tồn tại của cuộc hội thoại
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, user: { id: userId } },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Create the message
    const message = this.messageRepository.create({
      content: createMessageDto.content,
      sender_type: createMessageDto.sender_type,
      message_type: createMessageDto.message_type || 'text',
      conversation,
      // Include model_id if sender_type is 'model'
      ...(createMessageDto.sender_type === 'model' && {
        model_id: createMessageDto.model_id,
      }),
    });

    const savedMessage = await this.messageRepository.save(message);

    // Create attachments if provided
    if (
      createMessageDto.attachments &&
      createMessageDto.attachments.length > 0
    ) {
      // Create each attachment individually
      for (const attachmentDto of createMessageDto.attachments) {
        const attachment = this.attachmentRepository.create({
          ...attachmentDto,
          message: savedMessage,
        });
        await this.attachmentRepository.save(attachment);
      }
    }

    // Update conversation last updated timestamp
    await this.conversationRepository.update(
      { id: conversationId },
      { updated_at: new Date() },
    );

    // Return the message with attachments and model if it's a model message
    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: [
        'attachments',
        ...(createMessageDto.sender_type === 'model' ? ['model'] : []),
      ],
    });
  }

  async getMessages(
    conversationId: string,
    userId: string,
  ): Promise<Message[]> {
    // Trước tiên kiểm tra xem conversation có tồn tại và thuộc về user không
    const conversationCount = await this.conversationRepository.count({
      where: { id: conversationId, user: { id: userId } },
    });

    if (conversationCount === 0) {
      throw new Error('Conversation not found');
    }

    // Trực tiếp truy vấn messages mà không cần load toàn bộ conversation
    return this.messageRepository.find({
      where: { conversation: { id: conversationId } },
      relations: ['attachments', 'model'],
      order: { created_at: 'ASC' },
    });
  }

  async findAllWithDetails(userId: string): Promise<Conversation[]> {
    const conversations = await this.conversationRepository.find({
      where: { user: { id: userId } },
      relations: ['messages', 'messages.attachments', 'messages.model'],
      order: {
        updated_at: 'DESC',
        messages: { created_at: 'ASC' },
      },
    });

    return conversations;
  }

  async addMultipleMessages(
    conversationId: string,
    createMessageDtos: CreateMessageDto[],
    userId: string,
  ): Promise<Message[]> {
    // Kiểm tra xem cuộc hội thoại có tồn tại và thuộc về user không
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId, user: { id: userId } },
    });

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const savedMessages: Message[] = [];

    // Lưu từng tin nhắn một
    for (const createMessageDto of createMessageDtos) {
      // Tạo tin nhắn
      const message = this.messageRepository.create({
        content: createMessageDto.content,
        sender_type: createMessageDto.sender_type,
        message_type: createMessageDto.message_type || 'text',
        conversation,
        // Thêm model_id nếu sender_type là 'model'
        ...(createMessageDto.sender_type === 'model' && {
          model_id: createMessageDto.model_id,
        }),
      });

      const savedMessage = await this.messageRepository.save(message);

      // Tạo attachments nếu có
      if (
        createMessageDto.attachments &&
        createMessageDto.attachments.length > 0
      ) {
        // Tạo từng attachment
        for (const attachmentDto of createMessageDto.attachments) {
          const attachment = this.attachmentRepository.create({
            ...attachmentDto,
            message: savedMessage,
          });
          await this.attachmentRepository.save(attachment);
        }
      }

      // Thêm vào danh sách tin nhắn đã lưu
      const completeMessage = await this.messageRepository.findOne({
        where: { id: savedMessage.id },
        relations: [
          'attachments',
          ...(createMessageDto.sender_type === 'model' ? ['model'] : []),
        ],
      });

      if (completeMessage) {
        savedMessages.push(completeMessage);
      }
    }

    // Cập nhật thời gian cập nhật cuối cùng của cuộc hội thoại
    await this.conversationRepository.update(
      { id: conversationId },
      { updated_at: new Date() },
    );

    return savedMessages;
  }
}
