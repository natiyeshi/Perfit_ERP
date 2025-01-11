/*
  Warnings:

  - You are about to drop the column `batch` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `registered_products` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,competitorId]` on the table `competitor_inventories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `competitorId` to the `competitor_inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batch` to the `imports` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "competitor_inventories_productId_key";

-- AlterTable
ALTER TABLE "competitor_inventories" ADD COLUMN     "competitorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "imports" ADD COLUMN     "batch" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "batch";

-- DropTable
DROP TABLE "registered_products";

-- CreateIndex
CREATE UNIQUE INDEX "competitor_inventories_productId_competitorId_key" ON "competitor_inventories"("productId", "competitorId");

-- AddForeignKey
ALTER TABLE "competitor_inventories" ADD CONSTRAINT "competitor_inventories_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
