-- Performance indexes for the competitor_imports table.
--
-- Run these directly against production with psql. CONCURRENTLY builds the
-- index WITHOUT locking the table for writes (safe on a large, live table),
-- but it CANNOT run inside a transaction block — run each statement on its own,
-- not wrapped in BEGIN/COMMIT.
--
--   psql "$DATABASE_URL" -f prisma/manual/add_competitor_import_indexes.sql
--
-- IF NOT EXISTS makes this safe to re-run.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "competitor_imports_date_idx"
  ON "competitor_imports" ("date");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "competitor_imports_competitorId_idx"
  ON "competitor_imports" ("competitorId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "competitor_imports_supplierId_idx"
  ON "competitor_imports" ("supplierId");
