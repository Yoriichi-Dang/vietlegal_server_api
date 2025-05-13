import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  Req,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
  InternalServerErrorException,
  UseGuards,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import { CreateConversationDto } from 'src/core/dtos/conversation/create-conversation.dto';
import { UpdateConversationDto } from 'src/core/dtos/conversation/update-conversation.dto';
import { CreateMessageDto } from 'src/core/dtos/conversation/create-message.dto';
import { AddMultipleMessagesDto } from 'src/core/dtos/conversation/add-multiple-messages.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CreateConversationUsecase } from 'src/usecases/conversation/create-conversation.usecase';
import { FindAllConversationsUsecase } from 'src/usecases/conversation/find-all-conversations.usecase';
import { AddMessageUsecase } from 'src/usecases/conversation/add-message.usecase';
import { GetMessagesUsecase } from 'src/usecases/conversation/get-messages.usecase';
import { UpdateConversationUsecase } from 'src/usecases/conversation/update-conversation.usecase';
import { FindAllConversationsWithDetailsUsecase } from 'src/usecases/conversation/find-all-conversations-with-details.usecase';
import { RemoveConversationUsecase } from 'src/usecases/conversation/remove-conversation.usecase';
import { AddMultipleMessagesUsecase } from 'src/usecases/conversation/add-multiple-messages.usecase';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SensitiveDataInterceptor } from 'src/common/interceptors/sensitive-data.interceptor';

@ApiTags('Conversations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@UseInterceptors(SensitiveDataInterceptor)
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly createConversationUsecase: CreateConversationUsecase,
    private readonly findAllConversationsUsecase: FindAllConversationsUsecase,
    private readonly addMessageUsecase: AddMessageUsecase,
    private readonly getMessagesUsecase: GetMessagesUsecase,
    private readonly updateConversationUsecase: UpdateConversationUsecase,
    private readonly findAllConversationsWithDetailsUsecase: FindAllConversationsWithDetailsUsecase,
    private readonly removeConversationUsecase: RemoveConversationUsecase,
    private readonly addMultipleMessagesUsecase: AddMultipleMessagesUsecase,
  ) {}

  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiBody({
    description: 'Conversation creation payload',
    type: CreateConversationDto,
    examples: {
      conversation: {
        value: {
          title: 'New Conversation',
        },
      },
    },
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Conversation created successfully',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.createConversationUsecase.execute(
        createConversationDto,
        userId,
      );
    } catch {
      throw new UnauthorizedException('Failed to create conversation');
    }
  }

  @ApiOperation({ summary: 'Get all conversations for the authenticated user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all conversations',
  })
  @Get()
  public async getAllConversations(@Req() req: any) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.findAllConversationsUsecase.execute(userId);
    } catch {
      throw new UnauthorizedException('Failed to fetch conversations');
    }
  }

  @ApiOperation({ summary: 'Add a message to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiBody({
    description: 'Message creation payload',
    type: CreateMessageDto,
    examples: {
      message: {
        value: {
          content: 'Hello, this is a message',
          sender_type: 'user',
        },
      },
    },
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Message added successfully',
  })
  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  public async addMessage(
    @Param('id') conversationId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.addMessageUsecase.execute(
        conversationId,
        createMessageDto,
        userId,
      );
    } catch {
      throw new UnauthorizedException('Failed to add message to conversation');
    }
  }

  @ApiOperation({ summary: 'Get all messages from a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all messages in the conversation',
  })
  @Get(':id/messages')
  public async getConversationMessages(
    @Param('id') conversationId: string,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.getMessagesUsecase.execute(conversationId, userId);
    } catch {
      throw new UnauthorizedException('Failed to fetch conversation messages');
    }
  }

  @ApiOperation({ summary: 'Update a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiBody({
    description: 'Conversation update payload',
    type: UpdateConversationDto,
    examples: {
      conversation: {
        value: {
          title: 'Updated Conversation Title',
          is_archived: true,
        },
      },
    },
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Conversation updated successfully',
  })
  @Patch(':id')
  public async updateConversation(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.updateConversationUsecase.execute(
        id,
        updateConversationDto,
        userId,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new UnauthorizedException('Failed to update conversation');
    }
  }

  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Conversation deleted successfully',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeConversation(@Param('id') id: string, @Req() req: any) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      await this.removeConversationUsecase.execute(id, userId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Failed to delete conversation');
    }
  }

  @ApiOperation({
    summary: 'Get all conversations with messages, attachments and models',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all conversations with details',
  })
  @Get('with-details')
  public async getAllConversationsWithDetails(@Req() req: any) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.findAllConversationsWithDetailsUsecase.execute(userId);
    } catch (error) {
      console.error('Error fetching conversations with details:', error);
      throw new UnauthorizedException(
        'Failed to fetch conversations with details',
      );
    }
  }

  @ApiOperation({ summary: 'Add multiple messages to a conversation' })
  @ApiParam({ name: 'id', description: 'Conversation ID' })
  @ApiBody({
    description: 'Multiple messages creation payload',
    type: AddMultipleMessagesDto,
    examples: {
      messages: {
        value: {
          messages: [
            {
              content: 'Hello, this is message 1',
              sender_type: 'user',
            },
            {
              content: 'This is message 2 from a model',
              sender_type: 'model',
              model_id: 1,
            },
          ],
        },
      },
    },
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Messages added successfully',
  })
  @Post(':id/batch-messages')
  @HttpCode(HttpStatus.CREATED)
  public async addMultipleMessages(
    @Param('id') conversationId: string,
    @Body() addMultipleMessagesDto: AddMultipleMessagesDto,
    @Req() req: any,
  ) {
    try {
      const userId = req.user?.sub || 'test-user-id';
      return await this.addMultipleMessagesUsecase.execute(
        conversationId,
        addMultipleMessagesDto.messages,
        userId,
      );
    } catch (error) {
      console.error('Error adding multiple messages:', error);
      throw new UnauthorizedException('Failed to add messages to conversation');
    }
  }
}
