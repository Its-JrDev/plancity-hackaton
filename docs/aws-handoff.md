# AWS handoff (TODO)

Entregable: 3 imágenes (`web` Nginx :80, `api` Node :3000, `db` Postgres :5432),
Compose de referencia, vars (`VITE_API_URL`, `PORT`, `DATABASE_URL` local, `JWT_*`, `POSTGRES_*`),
healthchecks (`/` web y api, `pg_isready` db), volumen `pgdata`.
Secretos fuera del repo. Equipo externo decide RDS/instancias/red. Sin ECS/ECR prespuestos.
