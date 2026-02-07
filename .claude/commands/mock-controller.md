# Mock Controller Generator

Entity 이름을 받아서 테스트용 Mock Service가 포함된 Controller 테스트 코드를 생성합니다.

## 사용법

```
/mock-controller Book
```

## 생성할 코드

사용자가 입력한 Entity 이름(예: Book)으로 다음 코드를 생성하세요:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { {Entity}Controller } from './{entity}.controller';
import { {Entity}Service } from './{entity}.service';
import { {Entity} } from './entities/{entity}.entity';

describe('{Entity}Controller', () => {
  let controller: {Entity}Controller;
  let mockService: jest.Mocked<{Entity}Service>;

  const mock{Entity}: {Entity} = {
    id: 1,
    // TODO: Entity 속성 추가
  };

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [{Entity}Controller],
      providers: [
        {
          provide: {Entity}Service,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<{Entity}Controller>({Entity}Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll and return result', async () => {
      // Arrange
      mockService.findAll.mockResolvedValue([mock{Entity}]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockService.findAll).toHaveBeenCalled();
      expect(result).toEqual([mock{Entity}]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with parsed id', async () => {
      // Arrange
      mockService.findOne.mockResolvedValue(mock{Entity});

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(mockService.findOne).toHaveBeenCalledWith(1); // +id 변환됨
      expect(result).toEqual(mock{Entity});
    });
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      // Arrange
      const createDto = { /* TODO: DTO 속성 */ };
      mockService.create.mockResolvedValue(mock{Entity});

      // Act
      const result = await controller.create(createDto as any);

      // Assert
      expect(mockService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mock{Entity});
    });
  });

  describe('update', () => {
    it('should call service.update with parsed id', async () => {
      // Arrange
      const updateDto = { /* TODO: DTO 속성 */ };
      const updated = { ...mock{Entity}, ...updateDto };
      mockService.update.mockResolvedValue(updated);

      // Act
      const result = await controller.update('1', updateDto as any);

      // Assert
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return DeleteResult', async () => {
      // Arrange
      mockService.remove.mockResolvedValue({ raw: [], affected: 1 });

      // Act
      const result = await controller.remove('1');

      // Assert
      expect(mockService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ raw: [], affected: 1 });
    });
  });
});
```

## 주의사항

- `{Entity}`: PascalCase (예: Book, User)
- `{entity}`: lowercase (예: book, user)
- `mock{Entity}`: mock + PascalCase (예: mockBook, mockUser)
- Controller는 `+id`로 string→number 변환하므로 `toHaveBeenCalledWith(1)` (숫자)
- remove는 `DeleteResult` 반환: `{ raw: [], affected: 1 }`
