FROM postgres:16-alpine

EXPOSE 5432

HEALTHCHECK --interval=5s --timeout=3s --retries=10 CMD pg_isready -U "${POSTGRES_USER:-plancity}" -d "${POSTGRES_DB:-plancity}"
