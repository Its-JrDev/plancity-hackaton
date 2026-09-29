FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npm run migration:run && node dist/main"]
HEALTHCHECK --interval=10s --timeout=5s --retries=10 CMD wget -qO- http://localhost:3000/ >/dev/null 2>&1
