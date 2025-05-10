import { Injectable } from '@nestjs/common';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';

@Injectable()
export class FindOneAIModelUsecase {
  constructor(private readonly aiModelRepository: AIModelRepository) {}

  async execute(id: number) {
    const aiModel = await this.aiModelRepository.findOne(id);
    if (!aiModel) {
      throw new Error('AI model not found');
    }
    return aiModel;
  }
}
