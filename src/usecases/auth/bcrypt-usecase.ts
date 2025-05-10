import { Injectable, BadRequestException } from '@nestjs/common';
import { HashPasswordUsecase } from './hash-password-usecase';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptUsecase implements HashPasswordUsecase {
  async hashPassword(password: string | Buffer): Promise<string> {
    if (!password) {
      throw new BadRequestException('Password is required for hashing');
    }

    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string | Buffer,
    hash: string,
  ): Promise<boolean> {
    if (!password || !hash) {
      console.error('Missing parameters for password comparison', {
        passwordProvided: !!password,
        hashProvided: !!hash,
      });
      return false;
    }

    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Bcrypt comparison error:', error);
      return false;
    }
  }
}
