import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOkResponse({
    description: '모든 책 목록 반환',
    example: [
      {
        id: 1,
        title: '해리포터',
        author: 'J.K. 롤링',
        isbn: '978-3-16-148410-0',
        isAvailable: true,
      },
    ],
  })
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: '특정 책 반환',
    example: {
      id: 1,
      title: '해리포터',
      author: 'J.K. 롤링',
      isbn: '978-3-16-148410-0',
      isAvailable: true,
    },
  })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: `Book with id {id} not found`,
      error: 'Not Found',
    },
  })
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: '책 수정 성공' })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: 'Book with id {id} not found',
      error: 'Not Found',
    },
  })
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(+id, updateBookDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: '책 삭제 성공' })
  @ApiNotFoundResponse({
    description: '책을 찾을 수 없음',
    example: {
      statusCode: 404,
      message: 'Book with id {id} not found',
      error: 'Not Found',
    },
  })
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
