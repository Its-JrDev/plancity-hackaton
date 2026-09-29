# PlanCity — monorepo hackatón

Reestructuración de PlanCity (eventos locales) en monorepo con **Postgres dockerizada en el repo**. Sin Supabase externo.

Fuentes: `../riwi-react-perf-test` (web) y `../riwi-react-bknd-perf-test` (api). Ver `../PLAN_NUEVO_PROYECTO.md`.

## Arranque

```bash
cp .env.example .env
docker compose up --build
```

- Web: http://localhost:8080
- API: http://localhost:3000 (`/` → Hello World, `/api/docs` → Swagger)
- DB: localhost:5432 (`plancity/plancity`, volumen `pgdata`)

Admin demo (creado por migración): `admin@examen.com / Admin123!`

## Seed demo (8 categorías + 50 eventos + imágenes)

Opción A — vía API (flujo canonico hackatón, idempotente):
```bash
# 1) Levantar stack (aplica migracion + seed admin)
docker compose up --build

# 2) Ejecutar seed contra API (requiere credenciales admin en .env)
#    .env debe tener: SEED_ADMIN_EMAIL=admin@examen.com  SEED_ADMIN_PASSWORD=Admin123!
docker compose exec web npm run seed:api
```

Opción B — DB-only (psql directo, handoff AWS / debug):
```bash
# 1) Solo DB
docker compose up --build db

# 2) Esquema + admin (idempotente)
docker compose exec -T db psql -U plancity -d plancity \
  < database/migrations/1787602695769-InitSchema.sql

# 3) Demo data (idempotente, requiere esquema previo)
docker compose exec -T db psql -U plancity -d plancity \
  < database/seed/01-demo.sql
```

> El seed demo replica exactamente `apps/web/scripts/seed-api.mjs`:
> 8 categorías `Seed · Música|Arte...`, 50 eventos `PlanCity Seed · <tema> NN`
> (sep-oct 2026), precios 0/15000-40000, capacidad 40-180, 0-3 imágenes
> (Unsplash). Idempotente: re-ejecutar no duplica.

## Estado del scaffold

Mínimo: `apps/web|api` aún sin fuente copiada (ver TODO en cada `Dockerfile`).
Siguiente paso: copiar fuentes según `PLAN_NUEVO_PROYECTO.md`, quitar SSL Supabase en api, y reintentar `up --build`.
