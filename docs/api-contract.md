# Contrato mínimo de la API (DEV 2 — backend)

Fuente de verdad: controladores en `apps/api/src/modules/*/*.controller.ts`.
Sin prefijo global (`main.ts` no usa `setGlobalPrefix`). Swagger en `/api/docs`.
Errores con formato `{statusCode, message, error}`. Códigos: 400 (validación/UUID),
401 (sin token o inválido / credenciales), 403 (sin rol), 404 (no existe),
409 (duplicado: email, nombre de categoría/evento, favorito).

IDs siempre UUID string (`ParseUUIDPipe` en `:id` y `:eventId`).

| Método | Ruta | Auth / Rol | DTO | Uso |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Público | `RegisterDto{name min2, email, password min6}` | Crea usuario rol `user`, devuelve `{accessToken, user}`. 409 si email existe. |
| POST | `/auth/login` | Público | `LoginDto{email, password}` | Devuelve `{accessToken, user}` (`@HttpCode 200`). 401 si credenciales inválidas. |
| POST | `/auth/logout` | JWT | — | Stateless: confirma cierre; el cliente descarta el token. |
| GET | `/users/me` | JWT | — | Perfil del autenticado (`UserResponseDto`). |
| PATCH | `/users/me/password` | JWT | `{currentPassword, newPassword}` | Cambia contraseña. 401 si la actual no coincide. |
| GET | `/categories` | Público | — | Lista ordenada por nombre ASC. |
| GET | `/categories/:id` | Público | — | Detalle. 404 si no existe. 400 si UUID inválido. |
| POST | `/categories` | JWT + `admin` | `CreateCategoryDto{name, description?}` | Crea categoría. 403 si no es admin. 409 si nombre duplicado. |
| PATCH | `/categories/:id` | JWT + `admin` | `UpdateCategoryDto` (parcial) | Actualiza. 403/404/409 según caso. |
| DELETE | `/categories/:id` | JWT + `admin` | — | Elimina. `204` sin cuerpo. |
| GET | `/events?search=&categoryId=` | Público | `QueryEventDto{search?, categoryId?}` | Lista completa **sin paginación server** (el front pagina en cliente), orden fecha ASC, con categoría e imágenes. |
| GET | `/events/:id` | Público | — | Detalle con categoría e imágenes. 404 si no existe. |
| POST | `/events` | JWT + `admin` | `CreateEventDto{name, description?, date ISO, location, price ≥ 0, capacity, categoryId UUID, images? urls máx 10}` | Crea evento. 403 si no es admin. 404 si categoría no existe. 409 si nombre duplicado. |
| PATCH | `/events/:id` | JWT + `admin` | `UpdateEventDto` (parcial; si envía `images` las reemplaza) | Actualiza. 403/404/409 según caso. |
| DELETE | `/events/:id` | JWT + `admin` | — | Elimina. `204` sin cuerpo. |
| GET | `/favorites` | JWT | — | Devuelve `Event[]` del usuario, orden creación DESC. |
| POST | `/favorites/:eventId` | JWT | — | Añade favorito. 404 si evento no existe. 409 si duplicado. |
| DELETE | `/favorites/:eventId` | JWT | — | Quita favorito. `204` sin cuerpo. 404 si no era favorito. |
| GET | `/` | Público | — | Hello World (también HEALTHCHECK del contenedor). |
| GET | `/api/docs` | Público | — | Swagger. |

Notas:
- `DATABASE_URL` local sin SSL (`postgresql://plancity:plancity@db:5432/plancity` en Compose).
  El `ssl: { rejectUnauthorized: false }` de Supabase se eliminó de `app.module.ts` y `data-source.ts`.
- `synchronize: false`; el esquema + seed admin (`admin@examen.com / Admin123!`)
  los crea `1787602695769-InitSchema.ts` vía `migration:run` al arrancar el contenedor.
- CORS `origin: '*'`; `ValidationPipe(whitelist, forbidNonWhitelisted, transform)` global.
