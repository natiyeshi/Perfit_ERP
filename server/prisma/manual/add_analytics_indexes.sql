-- Analytics indexes, safe to run against a live production database.
--
-- CONCURRENTLY builds each index WITHOUT locking the table for writes, but it
-- CANNOT run inside a transaction block — run each statement on its own:
--
--   psql "$DATABASE_URL" -f prisma/manual/add_analytics_indexes.sql
--
-- IF NOT EXISTS makes this safe to re-run. Also run
-- add_competitor_import_indexes.sql if those indexes are missing too.

CREATE INDEX CONCURRENTLY IF NOT EXISTS "ProductWithPrice_productId_idx"
  ON "ProductWithPrice" ("productId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_supplierId_idx"
  ON "products" ("supplierId");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "competitor_imports_unit_price_idx"
  ON "competitor_imports" ("unit_price");

CREATE INDEX CONCURRENTLY IF NOT EXISTS "competitor_imports_created_at_idx"
  ON "competitor_imports" ("created_at");
