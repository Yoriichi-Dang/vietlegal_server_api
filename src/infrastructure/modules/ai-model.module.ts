import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModel } from 'src/core/domain/entities/chat/ai_model.entity';
import { Message } from 'src/core/domain/entities/chat/message.entity';
import { Attachment } from 'src/core/domain/entities/chat/attachment.entity';
import { AIModelController } from 'src/presentation/controllers/ai-model.controller';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';
import { CreateAIModelUsecase } from 'src/usecases/ai-model/create-ai-model.usecase';
import { FindAllAIModelsUsecase } from 'src/usecases/ai-model/find-all-ai-models.usecase';
import { FindOneAIModelUsecase } from 'src/usecases/ai-model/find-one-ai-model.usecase';
import { UpdateAIModelUsecase } from 'src/usecases/ai-model/update-ai-model.usecase';
import { RemoveAIModelUsecase } from 'src/usecases/ai-model/remove-ai-model.usecase';
import { AuthModule } from './auth.module';

@Module({
  controllers: [AIModelController],
  providers: [
    AIModelRepository,
    CreateAIModelUsecase,
    FindAllAIModelsUsecase,
    FindOneAIModelUsecase,
    UpdateAIModelUsecase,
    RemoveAIModelUsecase,
  ],
  imports: [
    TypeOrmModule.forFeature([AIModel, Message, Attachment]),
    AuthModule,
  ],
  exports: [
    AIModelRepository,
    CreateAIModelUsecase,
    FindAllAIModelsUsecase,
    FindOneAIModelUsecase,
    UpdateAIModelUsecase,
    RemoveAIModelUsecase,
  ],
})
export class AIModelModule {}
