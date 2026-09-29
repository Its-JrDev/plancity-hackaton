# Architecture (TODO)

- `db`: `database/Dockerfile` (postgres:16-alpine) + `init/00-extensions.sql` + volumen `pgdata`. Sin Supabase.
- `api`: NestJS, `migration:run` al arrancar, `DATABASE_URL` local sin SSL. Única con acceso a DB.
- `web`: Vite build + Nginx (`nginx.conf` con fallback SPA), `VITE_API_URL` como ARG.
- Red Compose por defecto, `api` espera a `db` healthy. Ver `../PLAN_NUEVO_PROYECTO.md`.
