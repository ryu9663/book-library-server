import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const thumbnail = `https://covers.openlibrary.org/b/isbn/${createBookDto.isbn}-M.jpg`;
    const book = this.bookRepository.create({ ...createBookDto, thumbnail });
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.findOne(id); // 없으면 NotFoundException
    const isDTOEmpty = Object.keys(updateBookDto).length === 0;
    if (isDTOEmpty) {
      return book;
    }
    Object.assign(book, updateBookDto);

    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    await this.findOne(id); // 없으면 NotFoundException
    return this.bookRepository.delete(id);
  }
}
