import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;
}
