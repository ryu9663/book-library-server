import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: jest.Mocked<BookService>;

  const mockBooks: Book[] = [
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
    mockBookService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        {
          provide: BookService,
          useValue: mockBookService,
        },
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  describe('findAll', () => {
    it('bookService.findAll()을 호출하고 결과를 반환해야 한다', async () => {
      mockBookService.findAll.mockResolvedValue(mockBooks);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockBookService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBooks);
    });
  });

  describe('findOne', () => {
    it('bookService.findOne을 호출하고 결과 반환', async () => {
      mockBookService.findOne.mockResolvedValue(mockBooks[0]);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(mockBookService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBooks[0]);
    });
  });

  describe('patch', () => {
    it('bookService.update호출하고 결과 반환', async () => {
      mockBookService.update.mockResolvedValue({
        ...mockBooks[0],
        title: '수정된 책이름',
      });

      const result = await controller.update('1', {
        title: '수정된 책이름',
      });

      expect(mockBookService.update).toHaveBeenCalledWith(1, {
        title: '수정된 책이름',
      });
      expect(result).toEqual({
        ...mockBooks[0],
        title: '수정된 책이름',
      });
    });
  });

  describe('remove', () => {
    it('bookService.remove 호출 결과 반환', async () => {
      mockBookService.remove.mockResolvedValue({ raw: [], affected: 1 });

      const result = await controller.remove('1');
      expect(mockBookService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ raw: [], affected: 1 });
    });
  });
});
