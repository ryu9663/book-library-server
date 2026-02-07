import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

const BOOK_EXAMPLE = {
  id: 1,
  title: '해리포터',
  author: 'J.K. 롤링',
  isbn: '978-3-16-148410-0',
  isAvailable: true,
};

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiCreatedResponse({ description: '책 생성 성공', example: BOOK_EXAMPLE })
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOkResponse({
    description: '모든 책 목록 반환',
    example: [BOOK_EXAMPLE],
  })
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: '특정 책 반환',
    example: BOOK_EXAMPLE,
  })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `Book with id {id} not found`,
      error: 'Not Found',
    },
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({
    description: '수정된 데이터 반환',
    example: {
      ...BOOK_EXAMPLE,
      ...{ title: '해리포터와 마법사의 돌' }, // 수정된 제목 예시
    },
  })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: 'Book with id {id} not found',
      error: 'Not Found',
    },
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: '삭제된 데이터 반환',
    example: { affected: 1 },
  })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `Book with id {id} not found`,
      error: 'Not Found',
    },
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
