import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

describe('LoanController', () => {
  let controller: LoanController;
  let mockService: jest.Mocked<LoanService>;

  const mockLoan = {
    id: 1,
    userId: 1,
    bookId: 1,
    borrowedAt: new Date('2024-01-01'),
    returnedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      returnBook: jest.fn(),
      findByUserId: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        {
          provide: LoanService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('대출 생성 후 결과 반환', async () => {
      const dto = { userId: 1, bookId: 1 };
      mockService.create.mockResolvedValue(mockLoan as any);

      const result = await controller.create(dto);

      expect(mockService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockLoan);
    });
  });

  describe('findAll', () => {
    it('전체 대출 목록 반환', async () => {
      mockService.findAll.mockResolvedValue([mockLoan] as any);

      const result = await controller.findAll();

      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockLoan]);
    });
  });

  describe('returnBook', () => {
    it('반납 처리 후 결과 반환', async () => {
      const returnedLoan = { ...mockLoan, returnedAt: new Date() };
      mockService.returnBook.mockResolvedValue(returnedLoan as any);

      const result = await controller.returnBook(1);

      expect(mockService.returnBook).toHaveBeenCalledWith(1);
      expect(result).toEqual(returnedLoan);
    });
  });

  describe('findByUserId', () => {
    it('특정 회원 대출 이력 반환', async () => {
      mockService.findByUserId.mockResolvedValue([mockLoan] as any);

      const result = await controller.findByUserId(1);

      expect(mockService.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockLoan]);
    });
  });
});
