import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('LoanService', () => {
  let service: LoanService;
  let mockLoanRepository: jest.Mocked<Repository<Loan>>;
  let mockUserRepository: jest.Mocked<Repository<User>>;
  let mockBookRepository: jest.Mocked<Repository<Book>>;

  let mockUser: User;
  let mockBook: Book;
  let mockLoan: Loan;

  beforeEach(async () => {
    mockLoanRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      count: jest.fn(),
    } as any;

    mockUserRepository = {
      findOne: jest.fn(),
    } as any;

    mockBookRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as any;

    mockUser = {
      id: 1,
      name: '홍길동',
      email: 'hong@test.com',
      loans: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    mockBook = {
      id: 1,
      title: '해리포터',
      author: 'J.K. 롤링',
      isbn: '978-3-16-148410-0',
      isAvailable: true,
      loans: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    mockLoan = {
      id: 1,
      userId: 1,
      user: mockUser,
      bookId: 1,
      book: mockBook,
      borrowedAt: new Date('2024-01-01'),
      returnedAt: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { userId: 1, bookId: 1 };

    it('존재하지 않는 유저 → NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('존재하지 않는 책 → NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('대출 불가능한 책 → ConflictException', async () => {
      const unavailableBook = { ...mockBook, isAvailable: false };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookRepository.findOne.mockResolvedValue(unavailableBook);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('활성 대출 5권 이상 → ConflictException', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockLoanRepository.count.mockResolvedValue(5);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('정상 대출 생성', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockLoanRepository.count.mockResolvedValue(0);
      mockLoanRepository.create.mockReturnValue(mockLoan);
      mockLoanRepository.save.mockResolvedValue(mockLoan);

      const result = await service.create(dto);

      expect(mockBookRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isAvailable: false }),
      );
      expect(mockLoanRepository.create).toHaveBeenCalled();
      expect(mockLoanRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockLoan);
    });
  });

  describe('returnBook', () => {
    it('존재하지 않는 대출 → NotFoundException', async () => {
      mockLoanRepository.findOne.mockResolvedValue(null);

      await expect(service.returnBook(999)).rejects.toThrow(NotFoundException);
    });

    it('이미 반납된 대출 → ConflictException', async () => {
      const returnedLoan = {
        ...mockLoan,
        returnedAt: new Date('2024-02-01'),
      };
      mockLoanRepository.findOne.mockResolvedValue(returnedLoan);

      await expect(service.returnBook(1)).rejects.toThrow(ConflictException);
    });

    it('정상 반납', async () => {
      const activeLoan = { ...mockLoan, book: { ...mockBook } };
      mockLoanRepository.findOne.mockResolvedValue(activeLoan);
      mockLoanRepository.save.mockResolvedValue({
        ...activeLoan,
        returnedAt: expect.any(Date),
      });

      const result = await service.returnBook(1);

      expect(mockBookRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ isAvailable: true }),
      );
      expect(mockLoanRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ returnedAt: expect.any(Date) }),
      );
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('전체 대출 목록 반환', async () => {
      mockLoanRepository.find.mockResolvedValue([mockLoan]);

      const result = await service.findAll();

      expect(result).toEqual([mockLoan]);
      expect(mockLoanRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'book'],
      });
    });
  });

  describe('findByUserId', () => {
    it('존재하지 않는 유저 → NotFoundException', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUserId(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('정상 조회', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockLoanRepository.find.mockResolvedValue([mockLoan]);

      const result = await service.findByUserId(1);

      expect(result).toEqual([mockLoan]);
      expect(mockLoanRepository.find).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['book'],
      });
    });
  });
});
