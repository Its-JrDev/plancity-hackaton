# ---- build ----
FROM node:20-alpine AS build
WORKDIR /app
# TODO hackatón (Dev 1): copiar fuente real de riwi-react-perf-test a apps/web
#   cp -r ../../riwi-react-perf-test/src ./src ; + package.json, vite.config.ts, etc.
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- serve ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://localhost/ >/dev/null 2>&1
