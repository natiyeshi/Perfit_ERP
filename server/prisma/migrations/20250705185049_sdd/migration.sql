/*
  Warnings:

  - You are about to drop the column `country` on the `competitors` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `competitors` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[license_number]` on the table `competitors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[manufacturerID]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `brandName` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genericName` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "competitors" DROP COLUMN "country",
DROP COLUMN "phone_number",
ADD COLUMN     "license_number" TEXT,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
DROP COLUMN "unit",
ADD COLUMN     "brandName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "genericName" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "manufacturerID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "competitors_license_number_key" ON "competitors"("license_number");

-- CreateIndex
CREATE UNIQUE INDEX "products_productId_key" ON "products"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_manufacturerID_key" ON "suppliers"("manufacturerID");
