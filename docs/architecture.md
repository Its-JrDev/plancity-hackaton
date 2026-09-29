# Architecture — PlanCity hackatón

Topología Compose (red por defecto, un network):

```text
web (Nginx :80) ──HTTP──> api (NestJS :3000) ──TCP──> db (Postgres :5432)
  VITE_API_URL            DATABASE_URL                      pgdata volume
```

## Servicios

- `db`: `build: ./database` (`FROM postgres:16-alpine`).
  - `COPY init/ /docker-entrypoint-initdb.d/` en la imagen + bind
    `./database/init:/docker-entrypoint-initdb.d:ro` en Compose para
    iteración local. Contenido: solo `00-extensions.sql` con
    `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`.
  - **Sin `CREATE TABLE`**: el esquema (`users`, `categories`, `events`,
    `event_images`, `favorites` + enum `users_role_enum`) y el seed admin
    (`admin@examen.com / Admin123!`) los crea exclusivamente
    `apps/api/src/migrations/1787602695769-InitSchema.ts` vía `migration:run`.
  - Env: `POSTGRES_USER/PASSWORD/DB` (default `plancity`). Sin credenciales
    hardcodeadas en el Dockerfile.
  - Volumen nombrado `pgdata:/var/lib/postgresql/data` → persistencia.
  - Healthcheck: `pg_isready -U ${POSTGRES_USER:-plancity} -d ${POSTGRES_DB:-plancity}`.
  - Puerto `5432:5432` solo para debug local.
- `api`: `build: ./apps/api` (Node 20, `migration:run && node dist/main`).
  - Única con acceso a la DB. `DATABASE_URL=postgresql://plancity:plancity@db:5432/plancity`
    **sin SSL** (el `ssl:{rejectUnauthorized:false}` era solo Supabase y debe
    eliminarse en `app.module.ts` + `data-source.ts`).
  - `depends_on: db condition: service_healthy` → espera a DB sana.
  - `synchronize:false`, migraciones en `__dirname/migrations/*`.
- `web`: `build: ./apps/web` con `ARG VITE_API_URL` (default
  `http://localhost:3000`). Multi-stage `node:20` → `nginx:alpine` con
  `nginx.conf` (`try_files $uri $uri/ /index.html` para SPA fallback).
  - `depends_on: api`. No accede a la DB, solo HTTP a la API.

## Volúmenes / red / builds

- Volumen: solo `pgdata` (datos Postgres). `restart db` conserva datos;
  `down -v` los recrea desde cero (migración + seed se re-ejecutan).
- Red: la por defecto de Compose. `api` resuelve `db` por nombre de servicio.
- Builds: 3 imágenes construibles sin contexto externo:
  `docker compose up --build` en limpio siguiendo solo el README.
  DB 100% local, prohibido Supabase/hosts externos en `DATABASE_URL`,
  Compose, docs o ejemplos.

## Migraciones y seeds (Dev 3)

### 1. Flujo canonico (hackatón) — API aplica todo
```bash
cp .env.example .env
docker compose up --build
# api espera a db healthy -> npm run migration:run (TypeORM)
# -> esquema + seed admin (admin@examen.com / Admin123!)
# Opcional demo data (8 cats + 50 events + imagenes):
# docker compose exec web npm run seed:api
#   (requiere SEED_ADMIN_EMAIL/PASSWORD o SEED_ACCESS_TOKEN en .env)
```

### 2. Flujo DB-only (handoff / debug) — psql directo
```bash
# 1) Esquema + admin (idempotente, re-ejecutable)
docker compose exec -T db psql -U plancity -d plancity \
  < database/migrations/1787602695769-InitSchema.sql

# 2) Demo data (idempotente, requiere esquema previo)
docker compose exec -T db psql -U plancity -d plancity \
  < database/seed/01-demo.sql
```

Archivos versionados en `database/`:
- `migrations/1787602695769-InitSchema.sql` — espejo SQL de la migración
  TypeORM (`apps/api/src/migrations/...InitSchema.ts`). Incluye:
  `uuid-ossp`, `pgcrypto`, enum `users_role_enum`, tablas
  `users/categories/events/event_images/favorites`, FKs
  (`events.category RESTRICT`, `images/favorites CASCADE`), seed admin
  con `crypt('Admin123!', gen_salt('bf',10))` (bcrypt cost 10).
- `seed/01-demo.sql` — equivalente DB-only de `apps/web/scripts/seed-api.mjs`
  (`npm run seed:api`). 8 categorías `Seed · ...` + 50 eventos
  `PlanCity Seed · <tema> NN` con fechas sep-oct 2026, precios 0-40000,
  capacidad 40-180, 0-3 imágenes/evento (Unsplash, mismo patrón
  `?auto=format&fit=crop&w=1200&q=80&sig=...`). Idempotente via
  `ON CONFLICT ("name")` / `WHERE NOT EXISTS`.

> **Regla:** la fuente de verdad en hackatón es `migration:run` de la API.
> Los `.sql` en `database/` son espejo idempotente para handoff AWS
> (equipo externo puede usar Postgres gestionado + psql sin TypeORM).

## Verificación DB (Dev 3)

```bash
cp .env.example .env
docker compose down -v && docker compose up --build db
docker compose exec db pg_isready -U plancity -d plancity
docker compose exec db psql -U plancity -d plancity -c "SELECT * FROM pg_extension WHERE extname='uuid-ossp';"
# Tablas aparecen solo tras arrancar api (migration:run):
docker compose up --build
docker compose exec db psql -U plancity -d plancity -c "\dt"
docker compose restart db   # datos sobreviven (volumen)
docker compose down -v      # recrea desde cero
```
