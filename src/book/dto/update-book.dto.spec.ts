import { validate } from 'class-validator';
import { UpdateBookDto } from './update-book.dto';

describe('UpdateBookDto 유효성 검사', () => {
  it('title만 있으면 성공', async () => {
    const dto = new UpdateBookDto();
    dto.title = '새로운 제목';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('title이 빈문자열이면 실패', async () => {
    const dto = new UpdateBookDto();
    dto.title = '';

    const errors = await validate(dto);

    const titleErrors = errors.find((e) => e.property === 'title');
    expect(titleErrors).toBeDefined();
  });

  it('title이 100자 초과하면 실패', async () => {
    const dto = new UpdateBookDto();
    dto.title = 'a'.repeat(101);

    const errors = await validate(dto);

    const titleErrors = errors.find((e) => e.property === 'title');
    expect(titleErrors).toBeDefined();
  });

  it('title이 1~100자면 성공', async () => {
    const dto = new UpdateBookDto();
    dto.title = 'a'.repeat(100);

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('author만 있으면 성공', async () => {
    const dto = new UpdateBookDto();
    dto.author = '새로운 작가';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('author이 빈문자열이면 실패', async () => {
    const dto = new UpdateBookDto();
    dto.author = '';

    const errors = await validate(dto);

    const authorErrors = errors.find((e) => e.property === 'author');
    expect(authorErrors).toBeDefined();
  });

  it('isbn 형식이 올바르지 않으면 실패', async () => {
    const dto = new UpdateBookDto();
    dto.isbn = 'invalid-isbn';

    const errors = await validate(dto);

    const isbnErrors = errors.find((e) => e.property === 'isbn');
    expect(isbnErrors).toBeDefined();
  });
  it('isbn 형식이 올바르면 성공', async () => {
    const dto = new UpdateBookDto();
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('모든 필드가 올바르면 성공', async () => {
    const dto = new UpdateBookDto();
    dto.title = '책제목';
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
