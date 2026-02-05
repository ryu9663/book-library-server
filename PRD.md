# PRD - Library Management API

## 프로젝트 개요

도서관 관리 REST API - 책 등록, 조회, 수정, 삭제 및 대출 관리

## 기술 스택

- NestJS + TypeORM + PostgreSQL
- class-validator (유효성 검사)
- Swagger (API 문서화)
- Jest (테스트)

---

## 기능 요구사항

### 1. Book (책 관리)

#### Entity

| 필드        | 타입    | 설명                  |
| ----------- | ------- | --------------------- |
| id          | number  | PK, 자동 생성         |
| title       | string  | 책 제목               |
| author      | string  | 저자                  |
| isbn        | string  | ISBN                  |
| isAvailable | boolean | 대출 가능 여부 (true) |

#### API

| 메서드 | 경로       | 설명      |
| ------ | ---------- | --------- |
| POST   | /books     | 책 등록   |
| GET    | /books     | 전체 조회 |
| GET    | /books/:id | 단일 조회 |
| PATCH  | /books/:id | 수정      |
| DELETE | /books/:id | 삭제      |

#### Validation

| 필드   | 규칙            |
| ------ | --------------- |
| title  | 필수, 1~100자   |
| author | 필수, 1자 이상  |
| isbn   | 필수, ISBN 형식 |

---

### 2. User (회원 관리) - TODO

#### Entity

| 필드      | 타입   | 설명            |
| --------- | ------ | --------------- |
| id        | number | PK              |
| name      | string | 이름            |
| email     | string | 이메일 (unique) |
| createdAt | Date   | 가입일          |

#### API

| 메서드 | 경로       | 설명      |
| ------ | ---------- | --------- |
| POST   | /users     | 회원 등록 |
| GET    | /users     | 전체 조회 |
| GET    | /users/:id | 단일 조회 |
| PATCH  | /users/:id | 수정      |
| DELETE | /users/:id | 삭제      |

---

### 3. Loan (대출 관리) - TODO

#### Entity

| 필드       | 타입   | 설명                 |
| ---------- | ------ | -------------------- |
| id         | number | PK                   |
| userId     | number | FK (User)            |
| bookId     | number | FK (Book)            |
| borrowedAt | Date   | 대출 일시            |
| returnedAt | Date   | 반납 일시 (nullable) |

#### API

| 메서드 | 경로              | 설명                |
| ------ | ----------------- | ------------------- |
| POST   | /loans            | 대출 신청           |
| PATCH  | /loans/:id/return | 반납 처리           |
| GET    | /loans            | 대출 목록           |
| GET    | /users/:id/loans  | 특정 회원 대출 이력 |

---

## 비기능 요구사항

- [ ] 에러 핸들링 (NotFoundException 등)
- [ ] 프로덕션 migration 설정
- [ ] E2E 테스트
- [ ] 인증/인가 (JWT)
