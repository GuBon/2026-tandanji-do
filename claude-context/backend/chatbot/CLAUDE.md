# CLAUDE.md — chatbot/

백엔드 AI 프록시. 프론트엔드 요청을 받아 AI 서버로 전달하고, 응답에 DB 데이터를 보강해 반환한다.

---

## 파일 구성

```
chatbot/
├── controller/ChatbotController.java
├── service/ChatbotService.java
└── dto/
    ├── ChatRecommendRequest.java
    ├── ChatRecommendResponse.java      (Item 내부 클래스 포함)
    ├── NutritionAnalysisRequest.java
    └── NutritionAnalysisResponse.java
```

---

## API 목록

```
POST /chatbot/recommend  (공개 — 인증 불필요)
  요청: { lat, lng, message, weather?, temperature? }
  응답: { reason, recommendations: Item[] }

POST /chatbot/analyze  (공개 — 인증 불필요)
  요청: { image }  // base64 Data URL ("data:image/...;base64,...")
  응답: { menuId?, menuName?, kcal?, carbs?, protein?, fat?, nutritionGrade?, nutritionTags?, reason }
```

SecurityConfig에 `permitAll()` 등록 완료.

---

## 핵심 설계

### AI 서버 연동 (ChatbotService)

```
AI 서버 URL: ${tandanji.ai.base-url}  ← application.properties 또는 .env로 주입 필수, repo 기본값 없음
              없으면 모든 챗봇 API 호출 시 AI_API_UNAVAILABLE(503) 발생

엔드포인트:
  POST /api/v1/tandanji-ai/recommendations
  POST /api/v1/tandanji-ai/nutrition-analysis

HTTP 클라이언트: HttpURLConnection (JDK 기본)
  connectTimeout: 10,000ms
  readTimeout:    90,000ms  ← AI worker 응답이 최대 90초 소요
```

RestClient/JDK HttpClient 대신 HttpURLConnection을 쓰는 이유: Spring Boot 4 + Jackson 3.x 환경에서 RestClient와 JDK HttpClient 모두 요청 바디가 null로 전달되는 422 오류 발생. HttpURLConnection으로 `requestBody.getBytes(UTF_8)`를 OutputStream에 직접 write하는 방식으로 해결.

### 추천 흐름 (recommend)

```
1. buildRecommendBody(req) → { location: {lat, lng}, weather?: {...}, message }
2. callAiPost("/api/v1/tandanji-ai/recommendations", body)
   AI 응답: { reason, recommendations: [ {storeId, menuId}, ... ] }
3. 각 item을 enrichRecommendItem(storeId, menuId)로 DB 보강
   → Store: storeName, address, lat, lon
   → Menu:  menuName, kcal, carbs, protein, fat, nutrition_info(grade, tags)
4. storeId/menuId 미매칭 item은 null 반환 → 목록에서 제외
```

### 영양분석 흐름 (analyzeNutrition)

```
1. callAiPost("/api/v1/tandanji-ai/nutrition-analysis", { image })
   AI 응답: { menuId?, reason }
2. menuId 없으면 → { reason } 만 반환
3. menuId 있으면 → menuRepository.findById(menuId)
   → kcal, carbs, protein, fat
   → nutrition_info JSONB 파싱 → grade, tags
4. 최종 NutritionAnalysisResponse 반환
```

### DTO 타입 규칙

- 영양 수치(`kcal`, `carbs`, `protein`, `fat`): 모두 `Long` — Menu 엔티티 타입과 일치
- `nutritionGrade`: `String` (`"GREEN"` | `"YELLOW"` | `"RED"` | null)
- `nutritionTags`: `List<String>` (null 가능 — `@JsonInclude(NON_NULL)`)
- `ChatRecommendResponse.Item`에 `Double lat`, `Double lon` 포함 — 프론트 지도 이동에 사용

### nutrition_info JSONB 파싱

```java
JsonNode info = objectMapper.readTree(menu.getNutritionInfo());
grade = info.path("grade").stringValue();   // Jackson 3.x: asText() 대신 stringValue()
```

`asText()` / `textValue()` 는 Jackson 3.x에서 deprecated. 반드시 `stringValue()` 사용.

### 오류 처리

| 상황 | ErrorCode |
|------|-----------|
| AI 응답 422 | `AI_INVALID_REQUEST` |
| AI 응답 4xx/5xx 또는 타임아웃 | `AI_API_UNAVAILABLE` |
| enrichRecommendItem 예외 | null 반환 (해당 item만 제외, 전체 실패 방지) |

---

## 규칙

- `callAiPost()`는 두 엔드포인트가 공유하는 단일 HTTP 헬퍼 — 분리하지 말 것
- `readTimeout`을 90초 미만으로 줄이지 말 것 (AI worker 응답 대기 필요)
- Jackson 3.x에서 `asText()`/`textValue()` 사용 금지 — `stringValue()` 사용
- RestClient / JDK HttpClient로 교체 시도 금지 (422 바디 누락 버그)
- `tandanji.ai.base-url` 미설정 시 503 오류 발생 — 로컬 실행 전 반드시 `.env`에 주입
