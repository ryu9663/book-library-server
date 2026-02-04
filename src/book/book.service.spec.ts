import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { NotFoundException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const results = await service.findAll();
      expect(results).toBeInstanceOf(Array);
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto = { title: '해리포터', author: 'J.K. 롤링', isbn: '123' };
      const book = { id: 1, ...dto, isAvailable: true };

      mockRepository.create.mockReturnValue(book);
      mockRepository.save.mockResolvedValue(book);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(book);
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      const book = {
        id: 1,
        title: '해리포터',
        author: 'J.K. 롤링',
        isbn: '123',
        isAvailable: true,
      };
      mockRepository.findOne.mockResolvedValue(book);

      const result = await service.findOne(1);

      expect(result).toEqual(book);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1 });
      await service.update(1, { title: '수정된 해리포터' });
      expect(mockRepository.save).toHaveBeenCalledWith({
        id: 1,
        title: '수정된 해리포터',
      });
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(1, { title: '수정된 해리포터' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockRepository.findOne.mockResolvedValue({ id: 1 });
      await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
