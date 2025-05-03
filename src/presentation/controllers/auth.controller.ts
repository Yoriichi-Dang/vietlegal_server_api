import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Req,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from 'src/core/dtos/auth/login.dto';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { AuthService } from 'src/usecases/auth/auth.service';
import { JwtService } from 'src/usecases/auth/jwt.service';
import { RefreshTokenDto } from 'src/core/dtos/auth/refresh-token.dto';
import { TokenResponse } from 'src/core/interfaces/auth/token-response.interface';
import { TokenResponseInterceptor } from 'src/common/interceptors/token-response.interceptor';
import { TokenResponseDto } from 'src/core/dtos/auth/token-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
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
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: TokenResponseDto,
  })
  @UseInterceptors(ClassSerializerInterceptor, TokenResponseInterceptor)
  @Post('register')
  @HttpCode(201)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerWithEmail(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
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
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: TokenResponseDto,
  })
  @UseInterceptors(TokenResponseInterceptor)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.loginWithEmail(loginDto);
  }

  @ApiOperation({ summary: 'Process Google OAuth callback' })
  @ApiResponse({
    status: 200,
    description: 'OAuth process completed successfully',
    type: TokenResponseDto,
  })
  @UseInterceptors(TokenResponseInterceptor)
  @Post('callback/google')
  async googleCallback(@Body() body: any) {
    try {
      // Handle the Google OAuth callback
      const profile = {
        email: body.email,
        name: body.name,
        picture: body.image,
        accessToken: body.accessToken,
        providerAccountId: body.googleId,
        idToken: body.idToken,
      };
      return this.authService.handleOAuthLogin(profile, 'google');
    } catch {
      throw new UnauthorizedException('Invalid OAuth callback');
    }
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({
    description: 'Refresh token payload',
    type: RefreshTokenDto,
    examples: {
      refreshToken: {
        value: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'New tokens generated successfully',
    type: TokenResponseDto,
  })
  @Post('refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<TokenResponse> {
    const tokens = await this.jwtService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );

    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return tokens;
  }

  @Get('session')
  async getSession(@Req() req: any) {
    try {
      // Extract token from request
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid token');
      }

      const token = authHeader.split(' ')[1];
      const payload = await this.jwtService.verifyToken(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.authService.getSession(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid session');
    }
  }
}
