import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    examples: {
      example1: {
        value: 'hoangnguyen241003@gmail.com',
      },
    },
  })
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  @ApiProperty({
    description: 'Password',
    examples: {
      example1: {
        value: 'Password123@',
      },
    },
  })
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @ApiProperty({
    description: 'Name of user',
    examples: {
      example1: {
        value: 'hoangnguyen241003',
      },
    },
  })
  name: string;
}
