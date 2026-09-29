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

## Estado del scaffold

Mínimo: `apps/web|api` aún sin fuente copiada (ver TODO en cada `Dockerfile`).
Siguiente paso: copiar fuentes según `PLAN_NUEVO_PROYECTO.md`, quitar SSL Supabase en api, y reintentar `up --build`.
