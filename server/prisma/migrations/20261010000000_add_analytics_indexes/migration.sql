-- Indexes for the analytics/report queries and the import table sort.
--
-- NOTE FOR PRODUCTION: run the CONCURRENTLY version in
-- prisma/manual/add_analytics_indexes.sql FIRST (no table locks). These
-- IF NOT EXISTS statements then become no-ops when this migration is deployed.

-- Join ProductWithPrice -> products in every product analytics query.
CREATE INDEX IF NOT EXISTS "ProductWithPrice_productId_idx" ON "ProductWithPrice" ("productId");
-- /suppliers loads deliverableProducts by supplierId.
CREATE INDEX IF NOT EXISTS "products_supplierId_idx" ON "products" ("supplierId");
-- Import table "sort by amount" (column is mapped to unit_price).
CREATE INDEX IF NOT EXISTS "competitor_imports_unit_price_idx" ON "competitor_imports" ("unit_price");
-- Pipeline report time filter (createdAt).
CREATE INDEX IF NOT EXISTS "competitor_imports_created_at_idx" ON "competitor_imports" ("created_at");
