FROM postgres:16-alpine

# Init versionado dentro de la imagen: solo extensiones/roles.
# El esquema + seed admin los crea apps/api via migration:run.
# Se mantiene también el bind ./database/init:/docker-entrypoint-initdb.d:ro
# en compose para iteración local, pero la imagen es autónoma sin él.
COPY init/ /docker-entrypoint-initdb.d/

EXPOSE 5432

HEALTHCHECK --interval=5s --timeout=3s --retries=10 CMD pg_isready -U "${POSTGRES_USER:-plancity}" -d "${POSTGRES_DB:-plancity}"
