# 2026 탄단지 DO

## 개발 서버

### 서버 접속 정보

| 항목 | 내용 |
| --- | --- |
| VM명 | Rocky-linux-9-test001 |
| IP:PORT | 192.168.1.200:22 |
| 접근 조건 | OpenVPN 접근 필요 |
| OS | Rocky Linux 9.5 |
| vCPU | 4 |
| Memory | 8 GB |
| Disk | 100 GB |
| 계정 | root |
| 비밀번호 | 별도 보관 |

### 예정 구성

- Docker 기반 서비스 운영
- PostGIS 17 이상 컨테이너 구성 예정
- 애플리케이션 배포 환경 구성 예정

## 개발 데이터베이스

개발 데이터베이스는 Docker Compose로 실행한다. 현재 구성은 PostgreSQL 17 + PostGIS 3.5 기반이다. 개발서버 환경값은 `.env`에 정의한다.

### 개발서버 실행 방법

배포 경로는 `/opt/tandanji-do`이다.

```bash
docker compose up -d postgis
docker compose ps
```

### 접속 정보

| 항목 | 기본값 |
| --- | --- |
| Host | 192.168.1.200 |
| Port | 5432 |
| Database | tandanji |
| User | tandanji |
| Password | tandanji |
| Schema | tandanji |

DB 포트는 OpenVPN 클라이언트에서 접속할 수 있도록 `0.0.0.0:5432`로 바인딩한다. 서버 방화벽은 `public` zone에 `5432/tcp`를 허용한다.

### Docker 구성

- 호스트 경로 바인드 마운트는 사용하지 않는다.
- DB 데이터는 Docker named volume `tandanji-do_postgis_data`에 보관한다.
- 별도 커스텀 네트워크는 정의하지 않고 Compose 기본 네트워크 `tandanji-do_default`를 사용한다.

### 환경 파일

`.env`는 개발서버 기준으로 설정한다.

```dotenv
COMPOSE_PROJECT_NAME=tandanji-do
POSTGIS_IMAGE_TAG=17-3.5-alpine
POSTGIS_BIND_ADDR=0.0.0.0
POSTGIS_HOST_PORT=5432
POSTGRES_DB=tandanji
POSTGRES_USER=tandanji
POSTGRES_PASSWORD=tandanji
APP_DB_SCHEMA=tandanji
APP_DB_USER=tandanji
APP_DB_PASSWORD=tandanji
```

개발서버에서는 접속 계정, 비밀번호, 기본 스키마를 모두 `tandanji`로 통일한다.

### DB 프로비저닝

앱 테이블이 `public`에 생성되지 않도록 별도 스키마를 사용한다.

- 앱 스키마: `tandanji`
- PostGIS 확장 스키마: `tandanji`
- 기본 `search_path`: `tandanji`
- `public` 스키마의 기본 생성 권한 제거

```bash
./scripts/provision-dev-db.sh
```

프로비저닝 SQL은 실행 순서를 분리한다.

- `sql/ddl/*.sql`: 스키마, 확장, 권한, 테이블 등 구조 정의
- `sql/insert/*.sql`: 개발용 기준 데이터 또는 seed 데이터 입력

### 로컬 실행 방법

로컬 환경에서는 기본 PostgreSQL 포트와 충돌하지 않도록 포트만 바꿔 실행한다.

```bash
POSTGIS_BIND_ADDR=127.0.0.1 POSTGIS_HOST_PORT=15432 docker compose up -d postgis
docker compose ps
```

| 항목 | 기본값 |
| --- | --- |
| Host | 127.0.0.1 |
| Port | 15432 |
| Database | tandanji |
| User | tandanji |
| Password | tandanji |
| Schema | tandanji |

### 확인 명령어

```bash
docker compose exec postgis psql -U tandanji -d tandanji -c "SELECT PostGIS_Version();"
```

애플리케이션 계정 기준 확인:

```bash
PGPASSWORD=tandanji psql -h 192.168.1.200 -p 5432 -U tandanji -d tandanji -c "SHOW search_path;"
```
