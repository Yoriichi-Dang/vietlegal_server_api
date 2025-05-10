import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIModel } from 'src/core/domain/entities/chat/ai_model.entity';
import { CreateAIModelDto } from 'src/core/dtos/ai-model/create-ai-model.dto';
import { UpdateAIModelDto } from 'src/core/dtos/ai-model/update-ai-model.dto';
import { IAIModelRepository } from 'src/core/interfaces/repositories/ai-model-repository.interface';
import { Attachment } from 'src/core/domain/entities/chat/attachment.entity';
import * as fs from 'fs';

@Injectable()
export class AIModelRepository implements IAIModelRepository {
  constructor(
    @InjectRepository(AIModel)
    private readonly aiModelRepository: Repository<AIModel>,
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
  ) {}

  async create(createAIModelDto: CreateAIModelDto): Promise<AIModel> {
    const aiModel = this.aiModelRepository.create(createAIModelDto);
    return this.aiModelRepository.save(aiModel);
  }

  async findAll(): Promise<AIModel[]> {
    return this.aiModelRepository.find();
  }

  async findOne(id: number): Promise<AIModel | null> {
    return this.aiModelRepository.findOne({
      where: { model_id: id },
      relations: ['messages'],
    });
  }

  async findByName(name: string): Promise<AIModel | null> {
    return this.aiModelRepository.findOne({
      where: { name },
    });
  }

  async update(
    id: number,
    updateAIModelDto: UpdateAIModelDto,
  ): Promise<AIModel | null> {
    const aiModel = await this.aiModelRepository.findOne({
      where: { model_id: id },
    });

    if (!aiModel) {
      return null;
    }

    await this.aiModelRepository.update({ model_id: id }, updateAIModelDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    try {
      // Tìm model AI cùng với các message và attachment liên quan
      const model = await this.aiModelRepository.findOne({
        where: { model_id: id },
        relations: ['messages', 'messages.attachments'],
      });

      if (!model) {
        return false;
      }

      // Xóa các file vật lý của attachment
      for (const message of model.messages) {
        for (const attachment of message.attachments) {
          try {
            const filePath = attachment.file_path;
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (fileError) {
            console.error(
              `Failed to delete file for attachment: ${attachment.attachment_id}`,
              fileError,
            );
            // Tiếp tục xử lý các file khác ngay cả khi có lỗi
          }
        }
      }

      // Xóa model AI (cascade sẽ tự động xóa các message và attachment)
      await this.aiModelRepository.remove(model);
      return true;
    } catch (error) {
      console.error('Error removing AI model:', error);
      return false;
    }
  }
}
