/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[competitorId]` on the table `competitors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[manufacturerId]` on the table `suppliers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "competitors" ADD COLUMN     "competitorId" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand";

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "manufacturerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "competitors_competitorId_key" ON "competitors"("competitorId");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_manufacturerId_key" ON "suppliers"("manufacturerId");
