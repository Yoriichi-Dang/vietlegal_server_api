import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenResponse } from 'src/core/interfaces/auth/token-response.interface';

interface TokenPayload {
  sub?: string;
  id?: string;
  email: string;
  [key: string]: any;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: TokenPayload): Promise<TokenResponse> {
    const accessTokenExpiresIn = parseInt(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') || '3600',
      10,
    ); // 1 hour default

    const refreshTokenExpiresIn = parseInt(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN') || '604800',
      10,
    ); // 7 days default

    // Extract id and create a new payload with sub
    const { id, ...payloadWithoutId } = payload;
    const tokenPayload = {
      ...payloadWithoutId,
      sub: id || payload.sub,
    };

    // Generate access token
    const accessToken = await this.jwtService.sign(tokenPayload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: accessTokenExpiresIn,
    });

    // Generate refresh token with a longer expiration
    const refreshToken = await this.jwtService.sign(tokenPayload, {
      secret:
        this.configService.get('JWT_REFRESH_TOKEN_SECRET') ||
        this.configService.get('JWT_SECRET'),
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: accessTokenExpiresIn,
    };
  }

  async verifyToken(token: string, isRefreshToken = false): Promise<any> {
    try {
      const secret = isRefreshToken
        ? this.configService.get('JWT_REFRESH_TOKEN_SECRET') ||
          this.configService.get('JWT_SECRET')
        : this.configService.get('JWT_SECRET');

      return this.jwtService.verify(token, { secret });
    } catch {
      return null;
    }
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<TokenResponse | null> {
    const payload = await this.verifyToken(refreshToken, true);

    if (!payload) {
      return null;
    }

    // Remove unnecessary properties from the payload
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, iat, type, ...restPayload } = payload;

    // Generate new tokens
    return this.generateTokens(restPayload);
  }
}
