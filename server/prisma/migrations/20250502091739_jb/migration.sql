/*
  Warnings:

  - You are about to drop the column `productId` on the `IODMProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IODMProduct" DROP COLUMN "productId",
ADD COLUMN     "product_id" TEXT;

-- AddForeignKey
ALTER TABLE "IODMProduct" ADD CONSTRAINT "IODMProduct_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
