# NestJS + TypeORM 개발 패턴

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
