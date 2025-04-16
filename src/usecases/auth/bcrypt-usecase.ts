import { Injectable } from '@nestjs/common';
import { HashPasswordUsecase } from './hash-password-usecase';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptUsecase implements HashPasswordUsecase {
  async hashPassword(password: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  async comparePassword(
    password: string | Buffer,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
