import { Injectable } from '@nestjs/common';
import { AIModelRepository } from 'src/infrastructure/adapters/repositories/ai-model-repository';

@Injectable()
export class FindAllAIModelsUsecase {
  constructor(private readonly aiModelRepository: AIModelRepository) {}

  async execute() {
    return this.aiModelRepository.findAll();
  }
}
