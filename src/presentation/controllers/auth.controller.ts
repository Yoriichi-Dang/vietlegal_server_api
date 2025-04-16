import {
  Controller,
  Post,
  Body,
  Inject,
  forwardRef,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/core/dtos/auth/login.dto';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { CreateUserUseCase } from 'src/usecases/user/create-user-usecase';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(forwardRef(() => CreateUserUseCase))
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    description: 'User creation payload',
    type: CreateUserDto,
    examples: {
      user: {
        value: {
          email: 'hoangnguyen241003@gmail.com',
          password: 'Password123@',
          username: 'hoangnguyen241003',
        },
      },
    },
    required: true,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({
    description: 'User login payload',
    type: LoginDto,
    required: true,
  })
  @ApiBody({
    description: 'User login payload',
    type: LoginDto,
    examples: {
      user: {
        value: {
          email: 'hoangnguyen241003@gmail.com',
          password: 'Password123@',
        },
      },
    },
    required: true,
  })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return {
      message: 'User logged in successfully',
      data: loginDto,
    };
  }
}
