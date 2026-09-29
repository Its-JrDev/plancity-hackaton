FROM node:20-alpine
WORKDIR /app
# TODO hackatón (Dev 2): copiar fuente real de riwi-react-bknd-perf-test a apps/api
#   Incluye src/modules, src/common, src/migrations, data-source, nest-cli, package.json...
#   OBLIGATORIO: quitar ssl rejectUnauthorized de app.module.ts y data-source.ts (era solo Supabase).
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build
EXPOSE 3000
# Migraciones (crean esquema + seed admin) y luego API prod
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD wget -qO- http://localhost:3000/ >/dev/null 2>&1
