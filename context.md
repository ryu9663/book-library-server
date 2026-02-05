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

| 메서드 | 경로       | 설명         |
| ------ | ---------- | ------------ |
| POST   | /books     | 책 등록      |
| GET    | /books     | 전체 책 조회 |
| GET    | /books/:id | 특정 책 조회 |
| PATCH  | /books/:id | 책 수정      |
| DELETE | /books/:id | 책 삭제      |

### DTO Validation

| 필드   | 규칙                           |
| ------ | ------------------------------ |
| title  | 최소 1자, 최대 100자           |
| author | 최소 1자                       |
| isbn   | ISBN 형식 (예: 978-3-16-148410-0) |

## 테스트 전략

- **방식**: TDD with Jest
- **Repository Mocking**: `getRepositoryToken(Entity)` 사용
- **DTO Validation**: `validate()` 함수로 직접 테스트
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
- [x] DTO Validation (class-validator) ✅
- [ ] Error Handling
- [x] Swagger 문서화 ✅
- [ ] 프로덕션용 migration 설정
- [ ] UpdateBookDto 유효성 검사 테스트
- [ ] E2E 테스트

## 주의 사항

- `synchronize: true` - 개발용! 프로덕션에서는 false로 변경 필요
- `.env` 파일은 gitignore됨
