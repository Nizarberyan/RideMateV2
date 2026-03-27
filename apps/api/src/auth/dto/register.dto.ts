import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'jane@example.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  name?: string;
}
