import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAIModelDto } from 'src/core/dtos/ai-model/create-ai-model.dto';
import { UpdateAIModelDto } from 'src/core/dtos/ai-model/update-ai-model.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateAIModelUsecase } from 'src/usecases/ai-model/create-ai-model.usecase';
import { FindAllAIModelsUsecase } from 'src/usecases/ai-model/find-all-ai-models.usecase';
import { FindOneAIModelUsecase } from 'src/usecases/ai-model/find-one-ai-model.usecase';
import { UpdateAIModelUsecase } from 'src/usecases/ai-model/update-ai-model.usecase';
import { RemoveAIModelUsecase } from 'src/usecases/ai-model/remove-ai-model.usecase';
import { RoleGuard } from 'src/common/guards/role.guard';
import { HasRoles } from 'src/common/decorators/has-roles.decorator';
import { RoleType } from 'src/core/domain/entities/user/role.entity';

@ApiTags('ai-models')
@Controller('ai-models')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIModelController {
  constructor(
    private readonly createAIModelUsecase: CreateAIModelUsecase,
    private readonly findAllAIModelsUsecase: FindAllAIModelsUsecase,
    private readonly findOneAIModelUsecase: FindOneAIModelUsecase,
    private readonly updateAIModelUsecase: UpdateAIModelUsecase,
    private readonly removeAIModelUsecase: RemoveAIModelUsecase,
  ) {}

  @Post()
  @UseGuards(RoleGuard)
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create a new AI model' })
  @ApiResponse({
    status: 201,
    description: 'The AI model has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required.' })
  async create(@Body() createAIModelDto: CreateAIModelDto) {
    try {
      return await this.createAIModelUsecase.execute(createAIModelDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create AI model',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all AI models' })
  @ApiResponse({
    status: 200,
    description: 'Return all AI models.',
  })
  async findAll() {
    try {
      return await this.findAllAIModelsUsecase.execute();
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve AI models',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific AI model by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the AI model.',
  })
  @ApiResponse({ status: 404, description: 'AI model not found.' })
  async findOne(@Param('id') id: string) {
    try {
      return await this.findOneAIModelUsecase.execute(+id);
    } catch (error) {
      throw new HttpException(
        error.message || 'AI model not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @UseGuards(RoleGuard)
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update an AI model' })
  @ApiResponse({
    status: 200,
    description: 'The AI model has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required.' })
  @ApiResponse({ status: 404, description: 'AI model not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateAIModelDto: UpdateAIModelDto,
  ) {
    try {
      return await this.updateAIModelUsecase.execute(+id, updateAIModelDto);
    } catch (error) {
      if (error.message === 'AI model not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to update AI model',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @HasRoles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete an AI model' })
  @ApiResponse({
    status: 200,
    description: 'The AI model has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required.' })
  @ApiResponse({ status: 404, description: 'AI model not found.' })
  async remove(@Param('id') id: string) {
    try {
      return await this.removeAIModelUsecase.execute(+id);
    } catch (error) {
      if (error.message === 'AI model not found') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Failed to delete AI model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
