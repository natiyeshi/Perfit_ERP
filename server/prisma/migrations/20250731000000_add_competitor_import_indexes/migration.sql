-- Indexes to speed up listing/sorting/filtering competitor imports.
--
-- NOTE FOR PRODUCTION: on a large, live table run the CONCURRENTLY version in
-- prisma/manual/add_competitor_import_indexes.sql FIRST (it does not lock the
-- table). These IF NOT EXISTS statements then become no-ops when this migration
-- is deployed, so migration history stays consistent without a second lock.

CREATE INDEX IF NOT EXISTS "competitor_imports_date_idx" ON "competitor_imports" ("date");
CREATE INDEX IF NOT EXISTS "competitor_imports_competitorId_idx" ON "competitor_imports" ("competitorId");
CREATE INDEX IF NOT EXISTS "competitor_imports_supplierId_idx" ON "competitor_imports" ("supplierId");
