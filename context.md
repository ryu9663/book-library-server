# api-something - Library Management API

## 프로젝트 개요

NestJS + TypeORM + PostgreSQL 기반의 도서관 관리 REST API

## 데이터베이스 설정

- **DB**: PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Database**: library
- **Password**: `.env` 파일의 `PASSWORD`

## 현재 구현된 기능

### Book Entity

| 컬럼        | 타입    | 설명                          |
| ----------- | ------- | ----------------------------- |
| id          | number  | 자동 생성 PK                  |
| title       | string  | 책 제목                       |
| author      | string  | 저자                          |
| isbn        | string  | ISBN                          |
| isAvailable | boolean | 대출 가능 여부 (기본값: true) |

### API 엔드포인트

| 메서드 | 경로      | 설명         |
| ------ | --------- | ------------ |
| POST   | /book     | 책 등록      |
| GET    | /book     | 전체 책 조회 |
| GET    | /book/:id | 특정 책 조회 |
| PATCH  | /book/:id | 책 수정      |
| DELETE | /book/:id | 책 삭제      |

## 테스트 전략

- **방식**: TDD with Jest
- **Repository Mocking**: `getRepositoryToken(Entity)` 사용
- **원칙**: Service는 실제 로직 테스트, Repository만 Mock

## 개발 명령어

```bash
pnpm install       # 의존성 설치
pnpm start:dev     # 개발 서버 실행
pnpm test          # 테스트 실행
pnpm test:watch    # 테스트 watch 모드
```

## 미구현 기능 (TODO)

- [ ] Loan Entity (대출 기능)
- [ ] DTO Validation (class-validator)
- [ ] Error Handling
- [ ] Swagger 문서화
- [ ] 프로덕션용 migration 설정

## 주의 사항

- `synchronize: true` - 개발용! 프로덕션에서는 false로 변경 필요
- `.env` 파일은 gitignore됨
