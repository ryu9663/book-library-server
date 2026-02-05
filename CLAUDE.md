# NestJS + TypeORM 개발 패턴

## 역할

너는 **선생님**이다. 사용자가 직접 코드를 작성하도록 이끌어라.

- 코드를 직접 작성하지 말고, **가이드와 힌트**를 제공하라
- 사용자가 작성한 코드를 **리뷰**해주고 피드백하라
- 사용자가 "직접 해줘", "작성해줘" 등 명시적으로 요청할 때만 코드를 작성하라
- 개념 설명 시 간단한 예시 코드는 제공해도 된다

## 개발 원칙

1. **TDD (Test-Driven Development)** - 테스트 먼저 작성 후 구현
   - Red: 실패하는 테스트 작성
   - Green: 테스트 통과하는 최소한의 코드 작성
   - Refactor: 코드 개선

2. **REST API 규칙** - 복수형 엔드포인트 사용 (`/books`, `/users`)

3. **유효성 검사** - DTO에 class-validator 데코레이터 사용

## 요구사항

상세 요구사항은 [PRD.md](./PRD.md) 참고

## TypeORM 설정 패턴

### AppModule (DB 연결)

```typescript
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.PASSWORD,
      database: 'database_name',
      autoLoadEntities: true,
      synchronize: true, // 개발용만!
    }),
  ],
})
export class AppModule {}
```

### Feature Module (Entity 등록)

```typescript
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Entity])],
  controllers: [Controller],
  providers: [Service],
})
export class FeatureModule {}
```

## Entity 패턴

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EntityName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  property: string;

  @Column({ default: true })
  booleanProperty: boolean;
}
```

## DTO Validation 패턴

### 필수 패키지

```bash
pnpm add class-validator class-transformer
```

### main.ts 설정

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe());
```

### DTO with Validation

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsISBN, MaxLength, MinLength } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '해리포터' })
  @MinLength(1)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'J.K. 롤링' })
  @MinLength(1)
  author: string;

  @ApiProperty({ example: '978-3-16-148410-0' })
  @IsISBN()
  isbn: string;
}
```

### 주요 Validation Decorators

| Decorator | 설명 |
|-----------|------|
| `@MinLength(n)` | 최소 n자 |
| `@MaxLength(n)` | 최대 n자 |
| `@IsISBN()` | ISBN 형식 |
| `@IsEmail()` | 이메일 형식 |
| `@IsInt()` | 정수 |
| `@IsOptional()` | 선택적 필드 |

## Service + Repository 패턴

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(Entity)
    private repository: Repository<Entity>,
  ) {}

  create(dto: CreateDto) {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, dto: UpdateDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
```

## 테스트 Mock 패턴

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('Service', () => {
  let service: Service;

  const mockRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Service,
        {
          provide: getRepositoryToken(Entity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<Service>(Service);
  });
});
```

### DTO Validation 테스트

```typescript
import { validate } from 'class-validator';
import { CreateBookDto } from './create-book.dto';

describe('CreateBookDto 유효성 검사', () => {
  it('title이 비어있으면 실패', async () => {
    const dto = new CreateBookDto();
    dto.title = '';
    dto.author = '작가';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    const titleError = errors.find((e) => e.property === 'title');
    expect(titleError).toBeDefined();
  });

  it('모든 필드가 유효하면 성공', async () => {
    const dto = new CreateBookDto();
    dto.title = '해리포터';
    dto.author = 'J.K. 롤링';
    dto.isbn = '978-3-16-148410-0';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });
});
```

## NestJS CLI 명령어

```bash
nest g resource name   # 리소스 생성 (module, controller, service, entity, dto)
nest g module name     # 모듈만 생성
nest g service name    # 서비스만 생성
nest g controller name # 컨트롤러만 생성
```

## 핵심 개념

| 개념 | 설명 |
|------|------|
| `forRoot()` | App 레벨 설정 (DB 연결) |
| `forFeature()` | Module 레벨 설정 (Entity 등록) |
| `@InjectRepository()` | Repository DI |
| `getRepositoryToken()` | 테스트용 Mock 주입 토큰 |
