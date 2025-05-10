import { Injectable } from '@nestjs/common';
import { CreateAIModelDto } from 'src/core/dtos/ai-model/create-ai-model.dto';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';

@Injectable()
export class CreateAIModelUsecase {
  constructor(private readonly aiModelRepository: AIModelRepository) {}

  async execute(createAIModelDto: CreateAIModelDto) {
    // Kiểm tra xem tên model đã tồn tại chưa
    const existingModel = await this.aiModelRepository.findByName(
      createAIModelDto.name,
    );
    if (existingModel) {
      throw new Error('AI model with this name already exists');
    }

    return this.aiModelRepository.create(createAIModelDto);
  }
}
