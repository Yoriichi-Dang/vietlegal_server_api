import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashPasswordUsecase {
  abstract hashPassword(password: string | Buffer): Promise<string>;
  abstract comparePassword(
    password: string | Buffer,
    encrypted: string,
  ): Promise<boolean>;
}
