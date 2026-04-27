#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

set -a
source "${ROOT_DIR}/.env"
set +a

: "${POSTGRES_DB:?POSTGRES_DB is required}"
: "${POSTGRES_USER:?POSTGRES_USER is required}"
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD is required}"
: "${APP_DB_SCHEMA:?APP_DB_SCHEMA is required}"
: "${APP_DB_USER:?APP_DB_USER is required}"
: "${APP_DB_PASSWORD:?APP_DB_PASSWORD is required}"

cd "${ROOT_DIR}"

run_sql_file() {
  local sql_file="$1"

  echo "==> ${sql_file#${ROOT_DIR}/}"

  docker compose exec -T \
    -e PGPASSWORD="${POSTGRES_PASSWORD}" \
    postgis psql \
    -U "${POSTGRES_USER}" \
    -d "${POSTGRES_DB}" \
    -v ON_ERROR_STOP=1 \
    -v db_name="${POSTGRES_DB}" \
    -v admin_user="${POSTGRES_USER}" \
    -v app_schema="${APP_DB_SCHEMA}" \
    -v app_user="${APP_DB_USER}" \
    -v app_password="${APP_DB_PASSWORD}" \
    -f - < "${sql_file}"
}

run_sql_dir() {
  local sql_dir="$1"
  local files=()

  shopt -s nullglob
  files=("${ROOT_DIR}/${sql_dir}"/*.sql)
  shopt -u nullglob

  for sql_file in "${files[@]}"; do
    run_sql_file "${sql_file}"
  done
}

run_sql_dir "sql/ddl"
run_sql_dir "sql/insert"
