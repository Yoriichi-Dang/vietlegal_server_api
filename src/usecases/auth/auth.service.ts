import {
  Injectable,
  UnauthorizedException,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { HashPasswordUsecase } from './hash-password-usecase';
import { IUserRepository } from 'src/core/interfaces/repositories/user-repository.inteface';
import { CreateUserDto } from 'src/core/dtos/auth/create-user.dto';
import { LoginDto } from 'src/core/dtos/auth/login.dto';
import { UserLogin } from 'src/core/domain/entities/user/user-login.entity';
import { UserData } from 'src/core/domain/entities/user/user-data.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly hashPasswordUsecase: HashPasswordUsecase,
  ) {}

  async registerWithEmail(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPasswordUsecase.hashPassword(
      createUserDto.password,
    );

    // Create user with userData
    const userData = new UserData();
    userData.name = createUserDto.name;

    const newUser = new UserLogin();
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.userData = userData;

    const savedUser = await this.userRepository.createUser(newUser);

    // Generate tokens
    const tokens = await this.jwtService.generateTokens({
      id: savedUser.id,
      email: savedUser.email,
    });

    return {
      user: savedUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async loginWithEmail(loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    // Find user with userData relation để lấy được avatarUrl
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has password (might not if registered with OAuth)
    if (!user.password) {
      throw new UnauthorizedException(
        'This account cannot be accessed with password login',
      );
    }

    // Check password
    try {
      const passwordValid = await this.hashPasswordUsecase.comparePassword(
        loginDto.password,
        user.password,
      );

      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      console.error('Password comparison error:', error);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.jwtService.generateTokens({
      id: user.id,
      email: user.email,
    });

    // Tạo phản hồi bao gồm thông tin người dùng cần thiết
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.userData?.name,
      avatarUrl: user.userData?.avatarUrl,
    };
    return {
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async handleOAuthLogin(profile: any, provider: string) {
    // First check if user exists by provider
    let user = await this.userRepository.findByProvider(provider, profile.id);

    // If not found by provider, try by email
    if (!user && profile.email) {
      user = await this.userRepository.findByEmail(profile.email);
    }

    // If user doesn't exist, create a new one
    if (!user) {
      const userData = new UserData();
      userData.name = profile.name;
      userData.avatarUrl = profile.picture;

      user = new UserLogin();
      user.email = profile.email;
      user.emailVerified = true;
      user.userData = userData;

      // Set OAuth info
      user.provider = provider;
      user.providerAccountId = profile.providerAccountId;
      user.accessToken = profile.accessToken;
      user.idToken = profile.idToken;
      user = await this.userRepository.createUser(user);
    }
    // If user exists but doesn't have this provider, update it
    else if (
      user.provider !== provider ||
      user.providerAccountId !== profile.id
    ) {
      await this.userRepository.updateUser(user.id, {
        provider,
        providerAccountId: profile.providerAccountId,
        accessToken: profile.accessToken,
        idToken: profile.idToken,
        emailVerified: true,
      });

      // Refresh user data
      user = await this.userRepository.findById(user.id);
    }

    // Generate tokens
    const tokens = await this.jwtService.generateTokens({
      id: user.id,
      email: user.email,
    });

    // Tạo phản hồi bao gồm thông tin người dùng cần thiết
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.userData?.name,
      avatarUrl: user.userData?.avatarUrl,
    };

    return {
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
    };
  }

  async getSession(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Tạo phản hồi bao gồm thông tin người dùng cần thiết
    return {
      id: user.id,
      email: user.email,
      name: user.userData?.name,
      avatarUrl: user.userData?.avatarUrl,
    };
  }
}
