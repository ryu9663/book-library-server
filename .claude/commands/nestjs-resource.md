# NestJS TDD Resource Generator

리소스 이름을 받아서 NestJS 리소스를 생성하고 TDD 설정까지 완료합니다.

## 사용법

```
/nestjs-resource Loan
```

## 실행 단계

1. **NestJS CLI로 리소스 생성**
   ```bash
   nest g resource {name} --no-spec
   ```
   - REST API 선택
   - CRUD entry points 생성

2. **Entity 파일 수정 안내**
   사용자에게 Entity 필드를 물어보고, `src/{name}/entities/{name}.entity.ts` 파일에 TypeORM 데코레이터 추가

3. **Module에 TypeORM 등록**
   `src/{name}/{name}.module.ts`에 다음 추가:
   ```typescript
   imports: [TypeOrmModule.forFeature([{Name}])],
   ```

4. **Service에 Repository 주입**
   `src/{name}/{name}.service.ts` 수정:
   ```typescript
   constructor(
     @InjectRepository({Name})
     private {name}Repository: Repository<{Name}>,
   ) {}
   ```

5. **테스트 파일 생성**
   `/mock-repo` 명령어 패턴으로 `{name}.service.spec.ts` 생성

6. **테스트 실행**
   ```bash
   pnpm test
   ```

## 체크리스트

- [ ] `nest g resource` 실행
- [ ] Entity에 @Entity, @Column 데코레이터 추가
- [ ] Module에 TypeOrmModule.forFeature 추가
- [ ] Service에 Repository 주입
- [ ] 테스트 파일 Mock 설정
- [ ] 테스트 통과 확인
