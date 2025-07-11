/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `competitor_imports` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_date` on the `competitor_imports` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `competitor_imports` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `competitor_imports` table. All the data in the column will be lost.
  - You are about to drop the column `license_number` on the `competitors` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `competitors` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `imports` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturerID` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the `_ImportToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[import_id]` on the table `competitor_imports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[licenseNumber]` on the table `competitors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tin]` on the table `competitors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `competitor_imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `import_id` to the `competitor_imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `imports` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ImportToProduct" DROP CONSTRAINT "_ImportToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImportToProduct" DROP CONSTRAINT "_ImportToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "competitor_imports" DROP CONSTRAINT "competitor_imports_productId_fkey";

-- DropIndex
DROP INDEX "competitors_license_number_key";

-- DropIndex
DROP INDEX "imports_uniqueId_key";

-- DropIndex
DROP INDEX "products_productId_key";

-- DropIndex
DROP INDEX "suppliers_manufacturerID_key";

-- AlterTable
ALTER TABLE "competitor_imports" DROP COLUMN "expiry_date",
DROP COLUMN "manufacturer_date",
DROP COLUMN "productId",
DROP COLUMN "quantity",
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "import_id" TEXT NOT NULL,
ADD COLUMN     "paymentMode" TEXT;

-- AlterTable
ALTER TABLE "competitors" DROP COLUMN "license_number",
DROP COLUMN "phoneNumber",
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "tin" TEXT;

-- AlterTable
ALTER TABLE "imports" DROP COLUMN "uniqueId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "name",
DROP COLUMN "productId",
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "intendedUse" TEXT,
ADD COLUMN     "product_id" TEXT,
ADD COLUMN     "unit" TEXT;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "manufacturerID",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "_ImportToProduct";

-- CreateTable
CREATE TABLE "ProductWithPrice" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ProductWithPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CompetitorImportToProductWithPrice" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CompetitorImportToProductWithPrice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductWithPrice_id_key" ON "ProductWithPrice"("id");

-- CreateIndex
CREATE INDEX "_CompetitorImportToProductWithPrice_B_index" ON "_CompetitorImportToProductWithPrice"("B");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_imports_import_id_key" ON "competitor_imports"("import_id");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_licenseNumber_key" ON "competitors"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_tin_key" ON "competitors"("tin");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_id_key" ON "products"("product_id");

-- AddForeignKey
ALTER TABLE "ProductWithPrice" ADD CONSTRAINT "ProductWithPrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imports" ADD CONSTRAINT "imports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorImportToProductWithPrice" ADD CONSTRAINT "_CompetitorImportToProductWithPrice_A_fkey" FOREIGN KEY ("A") REFERENCES "competitor_imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompetitorImportToProductWithPrice" ADD CONSTRAINT "_CompetitorImportToProductWithPrice_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductWithPrice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
