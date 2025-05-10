import { Injectable } from '@nestjs/common';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';

@Injectable()
export class RemoveAIModelUsecase {
  constructor(private readonly aiModelRepository: AIModelRepository) {}

  async execute(id: number) {
    // Kiểm tra xem model có tồn tại không
    const aiModel = await this.aiModelRepository.findOne(id);
    if (!aiModel) {
      throw new Error('AI model not found');
    }

    // Tiến hành xóa model
    const result = await this.aiModelRepository.remove(id);
    if (!result) {
      throw new Error('Failed to remove AI model');
    }

    return { success: true };
  }
}
