SELECT set_config('provision.db_name', :'db_name', false);
SELECT set_config('provision.admin_user', :'admin_user', false);
SELECT set_config('provision.app_schema', :'app_schema', false);
SELECT set_config('provision.app_user', :'app_user', false);
SELECT set_config('provision.app_password', :'app_password', false);

DO $$
DECLARE
  db_name text := current_setting('provision.db_name');
  admin_user text := current_setting('provision.admin_user');
  app_schema text := current_setting('provision.app_schema');
  app_user text := current_setting('provision.app_user');
  app_password text := current_setting('provision.app_password');
  wrong_extension_count integer;
  user_object_count integer;
BEGIN
  EXECUTE format('ALTER ROLE %I LOGIN PASSWORD %L', app_user, app_password);
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I AUTHORIZATION %I', app_schema, app_user);
  EXECUTE format('ALTER SCHEMA %I OWNER TO %I', app_schema, app_user);

  SELECT count(*)
    INTO wrong_extension_count
  FROM pg_extension e
  JOIN pg_namespace n ON n.oid = e.extnamespace
  WHERE e.extname IN ('postgis', 'fuzzystrmatch', 'postgis_topology', 'postgis_tiger_geocoder')
    AND NOT (e.extname = 'postgis' AND n.nspname = app_schema);

  IF wrong_extension_count > 0 THEN
    SELECT count(*)
      INTO user_object_count
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname <> 'information_schema'
      AND n.nspname NOT LIKE 'pg_%'
      AND c.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
      AND NOT EXISTS (
        SELECT 1
        FROM pg_depend d
        JOIN pg_extension e ON e.oid = d.refobjid
        WHERE d.objid = c.oid
          AND d.deptype = 'e'
      );

    IF user_object_count > 0 THEN
      RAISE EXCEPTION
        'Refusing to move PostGIS extensions because user objects already exist. Run this before app migrations.';
    END IF;

    DROP EXTENSION IF EXISTS postgis_tiger_geocoder CASCADE;
    DROP EXTENSION IF EXISTS postgis_topology CASCADE;
    DROP EXTENSION IF EXISTS postgis CASCADE;
    DROP EXTENSION IF EXISTS fuzzystrmatch CASCADE;
    DROP SCHEMA IF EXISTS tiger CASCADE;
    DROP SCHEMA IF EXISTS topology CASCADE;
    DROP SCHEMA IF EXISTS extensions CASCADE;
  END IF;

  EXECUTE format('CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA %I', app_schema);

  REVOKE CREATE ON SCHEMA public FROM PUBLIC;
  EXECUTE format('REVOKE CREATE ON SCHEMA public FROM %I', app_user);
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO %I', db_name, app_user);
  EXECUTE format('GRANT USAGE, CREATE ON SCHEMA %I TO %I', app_schema, app_user);
  EXECUTE format('ALTER ROLE %I IN DATABASE %I SET search_path = %I', app_user, db_name, app_schema);
  EXECUTE format('ALTER ROLE %I IN DATABASE %I SET search_path = %I', admin_user, db_name, app_schema);
  EXECUTE format('ALTER DATABASE %I SET search_path = %I', db_name, app_schema);
END
$$;

