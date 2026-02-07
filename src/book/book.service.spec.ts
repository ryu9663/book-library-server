import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('BookService', () => {
  let service: BookService;
  let mockRepository: jest.Mocked<Repository<Book>>;

  const mockBooks = [
    {
      id: 1,
      title: '해리포터',
      author: 'J.K. 롤링',
      isbn: '978-3-16-148410-0',
      isAvailable: true,
    },
    {
      id: 2,
      title: '반지의 제왕',
      author: '톨킨',
      isbn: '978-3-16-148410-1',
      isAvailable: true,
    },
  ];

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),

      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

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
    it('전체 데이터를 내려준다.', async () => {
      mockRepository.find.mockResolvedValue(mockBooks);
      const results = await service.findAll();
      expect(results).toBeInstanceOf(Array);
      expect(results).toHaveLength(2);
      expect(results).toEqual(mockBooks);
    });
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto = {
        title: '제3의 책',
        author: '제3의 저자',
        isbn: '978-3-16-148410-2',
      };

      mockRepository.create.mockReturnValue({
        ...dto,
        ...{ id: 3, isAvailable: true },
      } as any);
      mockRepository.save.mockResolvedValue({
        ...dto,
        ...{ id: 3, isAvailable: true },
      } as any);

      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        ...dto,
        ...{ id: 3, isAvailable: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a book', async () => {
      mockRepository.findOne.mockResolvedValue(mockBooks[0]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockBooks[0]);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('빈 객체를 받으면 데이터를 그대로 내려준다', async () => {
      mockRepository.findOne.mockResolvedValue(mockBooks[0]);

      const result = await service.update(1, {});
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result).toEqual(mockBooks[0]);
    });

    it('should update a book', async () => {
      const updatedBook = { ...mockBooks[0], title: '수정된 해리포터' };

      mockRepository.findOne.mockResolvedValue(mockBooks[0]);
      mockRepository.save.mockResolvedValue(updatedBook);

      const result = await service.update(1, { title: '수정된 해리포터' });

      expect(mockRepository.save).toHaveBeenCalledWith(updatedBook);
      expect(result).toEqual(updatedBook);
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
      mockRepository.findOne.mockResolvedValue(mockBooks[0]);
      await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
