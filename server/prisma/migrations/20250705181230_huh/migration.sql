/*
  Warnings:

  - You are about to drop the column `productId` on the `imports` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uniqueId]` on the table `imports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueId` to the `imports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "imports" DROP CONSTRAINT "imports_productId_fkey";

-- AlterTable
ALTER TABLE "imports" DROP COLUMN "productId",
ADD COLUMN     "uniqueId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ImportToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ImportToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ImportToProduct_B_index" ON "_ImportToProduct"("B");

-- CreateIndex
CREATE UNIQUE INDEX "imports_uniqueId_key" ON "imports"("uniqueId");

-- AddForeignKey
ALTER TABLE "_ImportToProduct" ADD CONSTRAINT "_ImportToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "imports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImportToProduct" ADD CONSTRAINT "_ImportToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
