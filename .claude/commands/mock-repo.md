# Mock Repository Generator

Entity 이름을 받아서 테스트용 Mock Repository 코드를 생성합니다.

## 사용법

```
/mock-repo Book
```

## 생성할 코드

사용자가 입력한 Entity 이름(예: Book)으로 다음 코드를 생성하세요:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { {Entity} } from './entities/{entity}.entity';
import { {Entity}Service } from './{entity}.service';

describe('{Entity}Service', () => {
  let service: {Entity}Service;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(entity => Promise.resolve({ id: 1, ...entity })),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {Entity}Service,
        {
          provide: getRepositoryToken({Entity}),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<{Entity}Service>({Entity}Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single entity', async () => {
      const entity = { id: 1, name: 'Test' };
      mockRepository.findOne.mockResolvedValue(entity);

      const result = await service.findOne(1);
      expect(result).toEqual(entity);
    });
  });

  describe('create', () => {
    it('should create and save entity', async () => {
      const dto = { name: 'Test' };
      const result = await service.create(dto);

      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update entity', async () => {
      const result = await service.update(1, { name: 'Updated' });
      expect(mockRepository.update).toHaveBeenCalledWith(1, { name: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should delete entity', async () => {
      const result = await service.remove(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
```

{Entity}는 사용자 입력으로, {entity}는 소문자로 변환하세요.
