# AWS handoff — PlanCity hackatón

Entregable hackatón (corre 100% local, sin dependencias externas):

- Monorepo con 3 Dockerfiles: `apps/web/Dockerfile` (Nginx),
  `apps/api/Dockerfile` (Node 20 + `migration:run`), `database/Dockerfile`
  (Postgres 16). + `docker-compose.yml` de referencia con DB local.
- El equipo externo decide instancias, red, almacenamiento, publicación de
  imágenes y Postgres gestionado si lo requiere. Esta guía no presupone
  ECS/EC2/ECR/RDS: solo documenta lo que el Compose local necesita.

## Puertos

- `web`: `8080:80` (Nginx sirve SPA).
- `api`: `3000:3000` (`GET /` Hello World, `GET /api/docs` Swagger).
- `db`: `5432:5432` solo debug local; en despliegue real no exponer.

## Healthchecks

- `db`: `pg_isready -U ${POSTGRES_USER:-plancity} -d ${POSTGRES_DB:-plancity}`
  (en Dockerfile e idéntico en Compose).
- `api`: `wget -qO- http://localhost:3000/` (requiere fuente copiada en `apps/api`).
- `web`: `wget -qO- http://localhost/` (requiere fuente copiada en `apps/web`).
- Orden: `api.depends_on: db condition: service_healthy`; `web.depends_on: api`.

## Variables (ver `.env.example`, nunca versionar `.env`)

```env
VITE_API_URL=http://localhost:3000   # build ARG web
PORT=3000
DATABASE_URL=postgresql://plancity:plancity@db:5432/plancity  # local, sin SSL, jamás Supabase
JWT_SECRET=cambiar-en-produccion-valor-largo-aleatorio        # requerido (:?)
JWT_EXPIRES_IN=1d
POSTGRES_USER=plancity
POSTGRES_PASSWORD=plancity
POSTGRES_DB=plancity
```

Secretos (`JWT_SECRET`, `POSTGRES_PASSWORD`, `SEED_ADMIN_PASSWORD`) fuera
del repo: inyectarlos en el entorno de despliegue, no en la imagen.

## Persistencia / init DB

- Volumen `pgdata:/var/lib/postgresql/data`. Sin él los datos se pierden al
  recrear el contenedor.
- Init en dos fases:
  1. `database/init/00-extensions.sql` (`uuid-ossp`) vía
     `/docker-entrypoint-initdb.d` (solo en volumen vacío).
  2. Esquema + seed admin vía `migration:run` al arrancar `api`
     (`1787602695769-InitSchema.ts`, `synchronize:false`).
- Nunca poner `CREATE TABLE` en `database/init/`.

## Cuestiones abiertas (decide equipo externo)

- Nombre/tag/registry de las 3 imágenes y estrategia de push.
- Tamaño/clase de instancia, réplicas (`api`/`web` sin estado; `db` con volumen).
- Backups/retención de `pgdata` o migración a Postgres gestionado
  (entonces `DATABASE_URL` apuntaría al endpoint gestionado con SSL, fuera
  del alcance del Compose local).
- Secretos (gestor a usar), TLS/terminación HTTPS, dominio y `VITE_API_URL` final.
- Confirmar formato de vars/volúmenes antes del cierre. No incluir secretos
  en el repo.
