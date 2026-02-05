import { validate } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

describe('CreateBookDto 유효성 검사', () => {
  it('title이 비어있으면 실패', async () => {
    const dto = new CreateBookDto();
    dto.title = '';
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const titleErrors = errors.find((e) => e.property === 'title');
    expect(titleErrors).toBeDefined();
  });
  it('title이 100자 초과하면 실패', async () => {
    const dto = new CreateBookDto();
    dto.title = 'a'.repeat(101);
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const titleErrors = errors.find((e) => e.property === 'title');
    expect(titleErrors).toBeDefined();
  });
  it('title이 1~100자면 성공', async () => {
    const dto = new CreateBookDto();
    dto.title = 'a'.repeat(100);
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const titleErrors = errors.find((e) => e.property === 'title');
    expect(titleErrors).toBeUndefined();
  });

  it('author가 비어있으면 실패', async () => {
    const dto = new CreateBookDto();
    dto.title = '책제목';
    dto.author = '';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const authorErrors = errors.find((e) => e.property === 'author');
    expect(authorErrors).toBeDefined();
  });
  it('author가 1자 이상이면 성공', async () => {
    const dto = new CreateBookDto();
    dto.title = '책제목'.repeat(100);
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const authorErrors = errors.find((e) => e.property === 'author');
    expect(authorErrors).toBeUndefined();
  });

  it('isbn 형식이 올바르지 않으면 실패', async () => {
    const dto = new CreateBookDto();
    dto.title = '책제목';
    dto.author = '작가';
    dto.isbn = 'invalid-isbn';

    const errors = await validate(dto);

    const isbnErrors = errors.find((e) => e.property === 'isbn');
    expect(isbnErrors).toBeDefined();
  });
  it('isbn 형식이 올바르면 성공', async () => {
    const dto = new CreateBookDto();
    dto.title = '책제목';
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const isbnErrors = errors.find((e) => e.property === 'isbn');
    expect(isbnErrors).toBeUndefined();
  });
});
