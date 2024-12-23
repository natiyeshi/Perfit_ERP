/*
  Warnings:

  - Made the column `created_at` on table `Inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `competitor_imports` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "competitor_imports" ALTER COLUMN "created_at" SET NOT NULL;
