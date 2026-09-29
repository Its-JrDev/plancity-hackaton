-- Espejo SQL de apps/api/src/migrations/1787602695769-InitSchema.ts (TypeORM).
-- Fuente de verdad: la migracion TypeORM via `npm run migration:run` al arrancar la API.
-- Este archivo existe para: revision sin TypeScript, flujo DB-only con psql y handoff AWS.
-- Es re-ejecutable (IF NOT EXISTS / ON CONFLICT / bloques DO con excepcion duplicada).
-- Corresponde a: enum users_role_enum + tablas users, categories, events,
-- event_images, favorites + FKs (events.category RESTRICT, images/favorites CASCADE)
-- + seed admin admin@examen.com (password Admin123!, bcrypt cost 10 via pgcrypto crypt()).

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(100) NOT NULL,
  "email" character varying(150) NOT NULL,
  "password" character varying(255) NOT NULL,
  "role" "public"."users_role_enum" NOT NULL DEFAULT 'user',
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_users_email" UNIQUE ("email"),
  CONSTRAINT "PK_users" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(100) NOT NULL,
  "description" character varying(255),
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
  CONSTRAINT "PK_categories" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "events" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" character varying(150) NOT NULL,
  "description" text,
  "date" TIMESTAMP NOT NULL,
  "location" character varying(200) NOT NULL,
  "price" numeric(10,2) NOT NULL,
  "capacity" integer NOT NULL DEFAULT '0',
  "category_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_events_name" UNIQUE ("name"),
  CONSTRAINT "PK_events" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "event_images" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "url" character varying(500) NOT NULL,
  "order" integer NOT NULL DEFAULT '0',
  "event_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_event_images" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "favorites" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "event_id" uuid NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_favorites_user_event" UNIQUE ("user_id", "event_id"),
  CONSTRAINT "PK_favorites" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "events" ADD CONSTRAINT "FK_events_category"
    FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "event_images" ADD CONSTRAINT "FK_event_images_event"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_user"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  ALTER TABLE "favorites" ADD CONSTRAINT "FK_favorites_event"
    FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Seed admin (igual que la migracion TS: bcrypt cost 10; aqui via pgcrypto).
-- ON CONFLICT lo hace idempotente; no pisa un password cambiado a posteriori.
INSERT INTO "users" ("name", "email", "password", "role")
VALUES ('Administrador', 'admin@examen.com', crypt('Admin123!', gen_salt('bf', 10)), 'admin')
ON CONFLICT ("email") DO NOTHING;
