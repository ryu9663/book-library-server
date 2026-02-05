import { ApiProperty } from '@nestjs/swagger';
import { IsISBN, MaxLength, MinLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '해리포터' })
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'J.K. 롤링' })
  @MinLength(1)
  author: string;

  @ApiProperty({ example: '978-3-16-148410-0' })
  @IsISBN()
  isbn: string;
}
