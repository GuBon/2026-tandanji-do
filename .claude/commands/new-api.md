# /new-api — 새 도메인 API 뼈대 생성

사용자가 도메인명과 엔드포인트를 지정하면 Spring Boot 패키지 뼈대를 생성한다.

## 사용법

```
/new-api <도메인명> <설명>
예) /new-api post 커뮤니티 게시글 CRUD
```

## 실행 절차

1. `backend/src/main/java/com/example/tdjmap/{도메인}/` 폴더 구조를 생성한다:
   - `controller/{Domain}Controller.java`
   - `service/{Domain}Service.java`
   - `dto/` — 필요한 Request/Response DTO 파일들

2. **Controller 패턴** (반드시 준수):
```java
@RestController
@RequestMapping("/{도메인복수형}")
@RequiredArgsConstructor
public class {Domain}Controller {
    private final {Domain}Service {domain}Service;
    // 메서드: ResponseEntity<ApiResponse<T>> 반환
}
```

3. **Service 패턴** (반드시 준수):
```java
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class {Domain}Service {
    // 쓰기 메서드만 @Transactional
    // userId: SecurityUtil.getCurrentUserId() 로만 추출
    // 조회 실패: throw new BusinessException(ErrorCode.XXX)
}
```

4. **DTO 패턴**:
   - Response: `@Getter @Builder @JsonInclude(JsonInclude.Include.NON_NULL)`
   - Request: `@Getter @NoArgsConstructor` + 필요한 validation 어노테이션

5. 필요한 `ErrorCode`를 `common/exception/ErrorCode.java`에 추가한다.

6. `docs/api/contracts.md` ⬜ 미구현 섹션에 설계한 엔드포인트 스펙을 추가한다.

## 규칙

- schema: `tandanji` (Entity `@Table(schema = "tandanji")`)
- ddl-auto=none — 테이블이 필요하면 psql SQL을 별도 안내만 하고 직접 실행하지 않는다
- 새 도메인은 반드시 feature 패키지 하위에 생성 (루트 패키지 직접 생성 금지)
- userId는 요청 파라미터/바디로 받지 않는다
