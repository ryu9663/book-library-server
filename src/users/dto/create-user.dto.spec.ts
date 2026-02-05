import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto 유효성 검사', () => {
  it('name이 비어있으면 실패', async () => {
    const dto = new CreateUserDto();
    dto.name = '';
    dto.email = 'invalid-email@email.com';

    const errors = await validate(dto);
    const nameErrors = errors.find((e) => e.property === 'name');
    expect(nameErrors).toBeDefined();
  });
  it('name이 1자 이상이면 성공', async () => {
    const dto = new CreateUserDto();
    dto.name = 'validname';
    dto.email = 'valid-email@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('email 형식이 올바르지 않으면 실패', async () => {
    const dto = new CreateUserDto();
    dto.name = 'validname';
    dto.email = 'invalid-email';

    const errors = await validate(dto);
    const emailErrors = errors.find((e) => e.property === 'email');
    expect(emailErrors).toBeDefined();
  });
  it('email 형식이 올바르면 성공', async () => {
    const dto = new CreateUserDto();
    dto.name = 'validname';
    dto.email = 'valid-email@example.com';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
