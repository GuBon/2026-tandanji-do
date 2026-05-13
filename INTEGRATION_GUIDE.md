# 탄단지도 AI 연계 활용 가이드

작성일: 2026-05-08

이 문서는 탄단지도 서비스에서 `tandanji-ai-api` 컨테이너를 호출할 때 필요한 연계 계약만 정리한다. 에이전트 내부 구현, DDL, seed, 운영 데이터 관리는 이 문서 범위가 아니다.

## 1. 연계 기준

서버 63 배포 기준 기본 URL:

```text
http://192.168.110.63:3221
```

호출 방식:

- `Content-Type: application/json`
- UTF-8 JSON
- 탄단지도 서비스 백엔드에서 서버 간 HTTP로 호출
- 브라우저 직접 호출은 권장하지 않음
- 현재 별도 API 인증 헤더는 없음
- 요청 추적이 필요하면 호출 측에서 `X-Request-Id`를 생성해 자체 로그에 저장

응답에서 내려오는 `storeId`, `menuId`는 화면 표시용 이름이 아니라 서비스 DB의 식별자다. 매장명, 메뉴명, 가격, 상세 영양값은 탄단지도 서비스 DB에서 별도로 조회해 표시한다.

## 2. 상태 확인

```http
GET /health
```

예시:

```bash
curl -s http://192.168.110.63:3221/health
```

정상 응답 예시:

```json
{
  "status": "ok",
  "database": {
    "connected": true,
    "database": "tandanji",
    "schema": "tandanji",
    "postgisInstalled": true
  },
  "ai": {
    "workerConfigured": true,
    "waitTimeoutSeconds": 90.0,
    "ruleFallback": true
  }
}
```

연계 판단:

- `status=ok`이고 `database.connected=true`이면 추천/이미지 분석 API 호출 가능
- `ai.workerConfigured=true`이면 플랫폼 worker 판단 경로 사용 가능
- worker가 실패해도 음식 추천은 규칙 기반 fallback을 사용

## 3. 음식 추천 API

```http
POST /api/v1/tandanji-ai/recommendations
```

요청:

```json
{
  "location": {
    "lat": 37.4563,
    "lng": 126.7041
  },
  "weather": {
    "condition": "rain",
    "temperature": 14
  },
  "message": "단백질 많고, 탄수화물 적은 음식 먹고 싶어"
}
```

필드 규칙:

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `location.lat` | O | 위도, `-90` 이상 `90` 이하 |
| `location.lng` | O | 경도, `-180` 이상 `180` 이하 |
| `weather.condition` | X | 날씨 문자열, 예: `rain`, `snow`, `sunny`, `cloudy` |
| `weather.temperature` | X | 기온, `-60` 이상 `70` 이하 |
| `message` | O | 사용자 자연어 요청, 1자 이상 1000자 이하 |

응답:

```json
{
  "recommendations": [
    { "storeId": 94, "menuId": 212 },
    { "storeId": 94, "menuId": 181 },
    { "storeId": 94, "menuId": 188 }
  ],
  "reason": "비 오는 날에 부담이 적도록 단백질 비중이 높고 탄수화물 부담이 적은 근처 메뉴를 추천해드려요."
}
```

처리 기준:

- `recommendations`는 최대 3개
- `reason`은 채팅/화면에 바로 표시 가능한 한국어 문장
- 추천 후보가 없으면 `recommendations: []`가 내려올 수 있음
- DB 업무 테이블이 일시적으로 조회되지 않아도 HTTP 200과 사용자용 fallback 문구를 반환

빈 추천 응답 예시:

```json
{
  "recommendations": [],
  "reason": "현재 위치 주변에서 추천할 수 있는 메뉴를 찾지 못했어요."
}
```

DB 데이터 미준비 fallback 예시:

```json
{
  "recommendations": [],
  "reason": "지금은 주변 매장과 메뉴 정보를 불러오는 중이라 정확한 추천을 확정하지 못했어요. 잠시 후 다시 시도해 주세요."
}
```

호출 예시:

```bash
curl -s http://192.168.110.63:3221/api/v1/tandanji-ai/recommendations \
  -H 'Content-Type: application/json' \
  -d '{
    "location": { "lat": 37.4563, "lng": 126.7041 },
    "weather": { "condition": "rain", "temperature": 14 },
    "message": "단백질 많고, 탄수화물 적은 음식 먹고 싶어"
  }'
```

## 4. 음식 이미지 분석 API

```http
POST /api/v1/tandanji-ai/nutrition-analysis
```

요청:

```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgAB..."
}
```

필드 규칙:

| 필드 | 필수 | 설명 |
| --- | --- | --- |
| `image` | O | `data:image/...;base64,` 형식의 Data URL |

응답:

```json
{
  "menuId": 45,
  "reason": "이미지와 가장 가까운 메뉴를 찾았어요."
}
```

매칭 실패 응답:

```json
{
  "menuId": null,
  "reason": "이미지에서 메뉴를 확정하지 못했어요. 다른 사진으로 다시 시도해 주세요."
}
```

DB 데이터 미준비 fallback 예시:

```json
{
  "menuId": null,
  "reason": "지금은 메뉴 정보를 불러오는 중이라 이미지 속 음식을 메뉴와 연결하지 못했어요. 잠시 후 다시 시도해 주세요."
}
```

처리 기준:

- `menuId`가 숫자이면 서비스 DB에서 메뉴 상세를 조회해 표시
- `menuId=null`은 정상 응답 범위로 처리
- 사용자 화면에는 `reason`을 그대로 표시 가능

## 5. 상태 코드 처리

| 상태 | 의미 | 연계 처리 |
| --- | --- | --- |
| `200` | 정상, 빈 후보, 매칭 실패, fallback 포함 | 응답 body의 `reason` 표시 |
| `422` | 요청 JSON 형식 또는 필드값 오류 | 사용자에게 원문 오류를 노출하지 말고 입력 재확인 문구 표시 |
| `5xx` | API 또는 인프라 오류 | 짧은 안내 문구 표시 후 필요 시 재시도 |
| timeout | worker 판단 대기 또는 네트워크 지연 | 클라이언트 timeout을 90초 이상 권장 |

권장 사용자 문구:

```text
요청을 처리하지 못했어요. 위치나 이미지를 다시 확인한 뒤 다시 시도해 주세요.
```

## 6. Timeout과 재시도

서버 배포 기준 worker 대기 시간은 90초다. 실제 테스트에서 추천 API는 입력에 따라 약 10초에서 25초 정도 걸렸다.

권장값:

- 서비스 백엔드 HTTP client timeout: 90초 이상
- 사용자 화면 로딩 timeout: 최소 60초 이상
- `422`는 재시도하지 않음
- 네트워크 timeout 또는 `5xx`는 1회 정도만 짧게 재시도
- `200` 응답의 빈 배열 또는 `menuId=null`은 실패로 보지 않음

## 7. 연계 처리 흐름

음식 추천:

1. 서비스 백엔드가 사용자 위치, 날씨, 메시지를 준비한다.
2. `POST /api/v1/tandanji-ai/recommendations`를 호출한다.
3. `recommendations`의 `storeId`, `menuId`로 서비스 DB에서 표시 데이터를 조회한다.
4. 채팅 또는 화면에는 `reason`을 함께 표시한다.
5. `recommendations`가 빈 배열이면 추천 카드 없이 `reason`만 표시한다.

음식 이미지 분석:

1. 서비스 백엔드가 업로드 이미지를 Data URL로 변환한다.
2. `POST /api/v1/tandanji-ai/nutrition-analysis`를 호출한다.
3. `menuId`가 숫자이면 서비스 DB에서 메뉴 상세를 조회한다.
4. `menuId=null`이면 메뉴 상세 조회 없이 `reason`만 표시한다.

## 8. 검증 결과

2026-05-08 서버 63 직접 포트 기준으로 확인했다.

| 케이스 | 결과 |
| --- | --- |
| `/health` | `200`, DB 연결 정상, worker 설정 정상 |
| 비 오는 날 고단백/저탄수 추천 | `200`, 추천 3개 반환 |
| 더운 날 가벼운 메뉴 추천 | `200`, 추천 3개 반환 |
| 추운 날 든든한 메뉴 추천 | `200`, 추천 3개 반환 |
| 눈 오는 날 메뉴 추천 | `200`, 추천 3개 반환 |
| 날씨 없는 균형 추천 | `200`, 추천 3개 반환 |
| 주변 후보 없는 위치 | `200`, `recommendations: []` 반환 |
| 잘못된 위도 | `422` 반환 |
| 작은 placeholder 이미지 | `200`, `menuId: null` 반환 |
| 잘못된 이미지 문자열 | `422` 반환 |

## 9. 연계 체크리스트

- 서비스 백엔드에서 서버 간 HTTP로 호출한다.
- `Content-Type: application/json`을 지정한다.
- 추천 응답의 빈 배열을 정상 케이스로 처리한다.
- 이미지 분석 응답의 `menuId=null`을 정상 케이스로 처리한다.
- 화면 표시용 문구는 `reason`을 우선 사용한다.
- `storeId`, `menuId` 상세 정보는 탄단지도 서비스 DB에서 조회한다.
- HTTP client timeout은 90초 이상으로 잡는다.
- 요청 추적이 필요하면 호출 측에서 `X-Request-Id`를 생성해 로그에 남긴다.
- DDL, seed, 운영 데이터 생성은 AI API가 아니라 탄단지도 서비스단 범위로 처리한다.
