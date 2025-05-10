import { AIModel } from 'src/core/domain/entities/chat/ai_model.entity';
import { CreateAIModelDto } from 'src/core/dtos/ai-model/create-ai-model.dto';
import { UpdateAIModelDto } from 'src/core/dtos/ai-model/update-ai-model.dto';

export interface IAIModelRepository {
  findAll(): Promise<AIModel[]>;
  findOne(id: number): Promise<AIModel | null>;
  findByName(name: string): Promise<AIModel | null>;
  create(createAIModelDto: CreateAIModelDto): Promise<AIModel>;
  update(
    id: number,
    updateAIModelDto: UpdateAIModelDto,
  ): Promise<AIModel | null>;
  remove(id: number): Promise<boolean>;
}
