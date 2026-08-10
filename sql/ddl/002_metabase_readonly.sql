-- Metabase 데이터 소스 연결용 읽기 전용 롤
-- 관리자 계정(tandanji)으로 tandanji DB에 접속한 뒤 실행한다.
--   docker compose exec -T postgis psql -U tandanji -d tandanji -f /sql/002_metabase_readonly.sql
-- 또는 호스트에서:
--   $env:PGPASSWORD='tandanji'; psql -h 127.0.0.1 -p 15432 -U tandanji -d tandanji -f sql/ddl/002_metabase_readonly.sql

-- 롤 생성 (이미 있으면 비밀번호만 갱신)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'metabase_ro') THEN
    CREATE ROLE metabase_ro LOGIN PASSWORD 'metabase_ro_pw';
  ELSE
    ALTER ROLE metabase_ro LOGIN PASSWORD 'metabase_ro_pw';
  END IF;
END
$$;

-- 접속 + 스키마 사용 + 기존 테이블 SELECT
GRANT CONNECT ON DATABASE tandanji TO metabase_ro;
GRANT USAGE ON SCHEMA tandanji TO metabase_ro;
GRANT SELECT ON ALL TABLES IN SCHEMA tandanji TO metabase_ro;

-- 앞으로 생길 테이블/뷰도 자동 SELECT 허용
-- (테이블 소유자가 app 유저 tandanji이므로 FOR ROLE tandanji 지정)
ALTER DEFAULT PRIVILEGES FOR ROLE tandanji IN SCHEMA tandanji
  GRANT SELECT ON TABLES TO metabase_ro;

-- Metabase가 테이블 목록을 조회할 때 search_path가 필요하므로 기본값 지정
ALTER ROLE metabase_ro IN DATABASE tandanji SET search_path = tandanji;
