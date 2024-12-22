/*
  Warnings:

  - Added the required column `shelf_life` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelf_life` to the `competitor_imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shelf_life` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "shelf_life",
ADD COLUMN     "shelf_life" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "competitor_imports" DROP COLUMN "shelf_life",
ADD COLUMN     "shelf_life" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "shelf_life",
ADD COLUMN     "shelf_life" INTEGER NOT NULL;
