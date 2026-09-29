# API contract (TODO — fuente: PLAN_NUEVO_PROYECTO.md § Contrato mínimo)

Sin prefijo `/api`. Ver Swagger en `/api/docs`.
`POST /auth/register|login|logout`, `GET /users/me`, `PATCH /users/me/password`,
`GET /categories[/:id]`, `POST/PATCH/DELETE /categories[/:id]` (admin),
`GET /events?search&categoryId` + `/:id` (público, sin paginación server),
`POST/PATCH/DELETE /events[/:id]` (admin),
`GET /favorites` → `Event[]`, `POST/DELETE /favorites/:eventId`.
Errores `{statusCode,message,error}`. 400/401/403/404/409.
