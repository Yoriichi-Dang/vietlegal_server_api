import { Injectable } from '@nestjs/common';
import { UpdateAIModelDto } from 'src/core/dtos/ai-model/update-ai-model.dto';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';

@Injectable()
export class UpdateAIModelUsecase {
  constructor(private readonly aiModelRepository: AIModelRepository) {}

  async execute(id: number, updateAIModelDto: UpdateAIModelDto) {
    // Kiểm tra xem model có tồn tại không
    const aiModel = await this.aiModelRepository.findOne(id);
    if (!aiModel) {
      throw new Error('AI model not found');
    }

    // Nếu cập nhật tên, kiểm tra xem tên đã tồn tại chưa
    if (updateAIModelDto.name && updateAIModelDto.name !== aiModel.name) {
      const existingModel = await this.aiModelRepository.findByName(
        updateAIModelDto.name,
      );
      if (existingModel) {
        throw new Error('AI model with this name already exists');
      }
    }

    return this.aiModelRepository.update(id, updateAIModelDto);
  }
}
