# CLAUDE.md — record 패키지

식단 기록(DietLog) + 운동 기록(ExerciseLog) + 체중 이력(WeightLog). 3개의 서비스를 RecordController 하나로 묶는다.

---

## 파일 구성

```
record/
├── controller/RecordController.java    모든 기록 엔드포인트 통합 (3개 서비스 주입)
├── service/DietRecordService.java
├── service/ExerciseRecordService.java
├── service/WeightLogService.java       createLog(User, double) — UserService에서도 호출됨
└── dto/
    ├── DietLogCreateRequest.java       menuId?, foodName, mealType, logKcal(필수), logCarbs?, logProtein?, logFat?, logSugar?, imgUrl?, ateAt(필수)
    ├── DietLogResponse.java            logId, menuId?, foodName?, mealType?, logKcal, logCarbs?, logProtein?, logFat?, logSugar?, imgUrl?, ateAt
    ├── ExerciseLogCreateRequest.java   typeId, title?, durationMin(필수), memo?  ※ caloriesBurned 필드 있으나 무시됨
    ├── ExerciseLogResponse.java        exerciseId, typeId, typeName, title?, durationMin, caloriesBurned, memo?, createdAt
    ├── ExerciseTypeResponse.java       typeId, typeName, metValue, iconUrl
    └── WeightLogResponse.java          logId, weightKg, recordedAt
```

---

## API 목록

```
GET  /diet-logs    ?date=yyyy-MM-dd    날짜별 식단 조회 (ateAt 내림차순)
POST /diet-logs
  Body: { menuId?, foodName, mealType, logKcal(필수), logCarbs?, logProtein?, logFat?,
          logSugar?, imgUrl?, ateAt(필수) }
  ※ DB CHECK: menu_id IS NOT NULL OR food_name IS NOT NULL
  Response 201: DietLogResponse
DELETE /diet-logs/{logId}             본인만 삭제 (403 FORBIDDEN)

GET  /exercise-types                  운동 종목 목록 (전체)
GET  /exercise-logs  ?date=yyyy-MM-dd 날짜별 운동 조회 (createdAt 내림차순)
POST /exercise-logs
  Body: { typeId, title?, durationMin(필수), memo? }
  ※ caloriesBurned 전송해도 무시 — 서버가 MET × weight × time(h)으로 계산
  ※ user.weight null 시 기본값 65kg 적용
  Response 201: ExerciseLogResponse
DELETE /exercise-logs/{exerciseId}    본인만 삭제 (403 FORBIDDEN)

GET  /weight-logs                     내 체중 이력 전체 (recordedAt ASC)
                                      Response: List<WeightLogResponse>
```

---

## 핵심 설계

### 칼로리 계산 공식 (ExerciseRecordService)

```java
long weightKg = user.getWeight() != null ? user.getWeight() : 65L;
caloriesBurned = Math.round(type.getMetValue().doubleValue() * weightKg * (durationMin / 60.0))
```

`ExerciseType.metValue`는 `NUMERIC(4,2)` 타입. 기본 65kg은 리터럴로 존재 — 변경 시 `calculateCaloriesBurned()` 수정.

### WeightLogService.createLog 사이드 이펙트

`PUT /users/me` 요청에서 weight 필드가 있으면 `UserService.updateMe()`가 자동으로 `WeightLogService.createLog(user, weight)` 호출.  
→ 체중 직접 적립 POST API 없음 — weight 변경만으로 이력 자동 기록.

### 날짜 범위 쿼리

```java
// 식단
findByUserIdAndAteAtBetweenOrderByAteAtDesc(userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay())

// 운동
findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(userId, date.atStartOfDay(), date.plusDays(1).atStartOfDay())
```

프론트에서 로컬 datetime 문자열로 `ateAt` 전송 → `LocalDateTime`으로 수신.

---

## Repository 메서드

```java
// DietLogRepository
List<DietLog> findByUserIdAndAteAtBetweenOrderByAteAtDesc(Long userId, LocalDateTime start, LocalDateTime end)

// ExerciseLogRepository
List<ExerciseLog> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(Long userId, LocalDateTime start, LocalDateTime end)

// ExerciseTypeRepository
List<ExerciseType> findAll()  // 종목 수가 적으므로 전체 조회

// WeightLogRepository
List<WeightLog> findByUser_IdOrderByRecordedAtAsc(Long userId)
```

---

## 규칙

- `caloriesBurned`는 클라이언트에서 전송해도 무시 — 서버 계산이 항상 적용됨
- 삭제 권한 불일치: 식단·운동 모두 `FORBIDDEN`(403)
- 체중 기록은 `PUT /users/me` weight 변경 시만 자동 생성 — WeightLogService에 별도 `POST` 엔드포인트 없음
