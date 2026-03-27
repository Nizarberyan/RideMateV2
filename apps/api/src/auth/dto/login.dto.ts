import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'jane@example.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsNotEmpty()
  password!: string;
}
