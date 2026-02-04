import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: '해리포터' })
  title: string;

  @ApiProperty({ example: 'J.K. 롤링' })
  author: string;

  @ApiProperty({ example: '978-3-16-148410-0' })
  isbn: string;
}
