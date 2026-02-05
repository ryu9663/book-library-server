import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe' })
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'john_doe@example.com' })
  @IsEmail()
  email: string;
}
