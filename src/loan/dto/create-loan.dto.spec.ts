import { validate } from 'class-validator';
import { CreateLoanDto } from './create-loan.dto';

describe('CreateLoanDto 유효성 검사', () => {
  it('userId 누락 시 실패', async () => {
    const dto = new CreateLoanDto();
    dto.bookId = 1;

    const errors = await validate(dto);

    const userIdError = errors.find((e) => e.property === 'userId');
    expect(userIdError).toBeDefined();
  });

  it('userId가 정수가 아니면 실패', async () => {
    const dto = new CreateLoanDto();
    dto.userId = 1.5 as any;
    dto.bookId = 1;

    const errors = await validate(dto);

    const userIdError = errors.find((e) => e.property === 'userId');
    expect(userIdError).toBeDefined();
  });

  it('bookId 누락 시 실패', async () => {
    const dto = new CreateLoanDto();
    dto.userId = 1;

    const errors = await validate(dto);

    const bookIdError = errors.find((e) => e.property === 'bookId');
    expect(bookIdError).toBeDefined();
  });

  it('bookId가 정수가 아니면 실패', async () => {
    const dto = new CreateLoanDto();
    dto.userId = 1;
    dto.bookId = 1.5 as any;

    const errors = await validate(dto);

    const bookIdError = errors.find((e) => e.property === 'bookId');
    expect(bookIdError).toBeDefined();
  });

  it('모든 필드가 유효하면 성공', async () => {
    const dto = new CreateLoanDto();
    dto.userId = 1;
    dto.bookId = 1;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
