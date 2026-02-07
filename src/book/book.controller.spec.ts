import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: jest.Mocked<BookService>;

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
});
