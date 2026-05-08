# Geolocation 방식 비교

## 기존 방식 — 브라우저 GPS 단독

```
앱 로드
  → navigator.permissions.query('geolocation')
      ├─ denied: 종료 (아무것도 안 함)
      └─ granted/prompt: getCurrentPosition
            ├─ 성공: 지도 이동
            └─ 실패: console.warn 후 종료
```

- 위치 소스: 브라우저 GPS(`navigator.geolocation`) 하나뿐
- 권한 거부 시 또는 GPS 미지원 환경(데스크톱 일부)에서는 위치를 아예 못 잡음
- 획득한 좌표를 외부에 저장하지 않음 — 새로고침하면 다시 물어봐야 함
- 공인 IP 조회 없음

---

## 현재 방식 — GPS 우선 + REST API Fallback

```
앱 로드
  → ipify 로 공인 IP 조회
  → navigator.geolocation 존재 여부 확인
      ├─ 없음: GET /location (IP 기반) → 지도 이동
      └─ 있음: getCurrentPosition 시도
              ├─ 성공: 지도 이동 → POST /location/gps 저장 (백그라운드)
              └─ 실패/거부: GET /location (IP 기반) → 지도 이동
```

- 위치 소스: GPS → 실패 시 REST API(`mapprime.synology.me`) 순서로 폴백
- GPS 거부·미지원 환경에서도 IP 기반으로 위치 제공
- GPS 성공 시 서버에 좌표 저장(`POST /location/gps`) → 다른 기기에서도 마지막 위치 재사용 가능
- 모든 REST 요청에 `X-Client-Public-IP` 헤더 포함

---

## 핵심 차이 요약

| 항목 | 기존 | 현재 |
|------|------|------|
| 위치 소스 | GPS 전용 | GPS → REST API 폴백 |
| GPS 거부 시 | 위치 없음 | IP 기반 위치 제공 |
| GPS 성공 시 좌표 저장 | 없음 | `POST /location/gps` |
| 공인 IP 조회 | 없음 | ipify 사용 |
| 권한 사전 체크 | `navigator.permissions.query` | 불필요 (에러 콜백에서 처리) |
| `MapPage.jsx` 영향 | — | 없음 (인터페이스 동일) |
