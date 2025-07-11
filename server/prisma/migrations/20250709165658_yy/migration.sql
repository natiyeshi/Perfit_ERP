/*
  Warnings:

  - You are about to drop the column `productId` on the `CostBuildUp` table. All the data in the column will be lost.
  - You are about to drop the column `seaFreightCharge` on the `CostBuildUp` table. All the data in the column will be lost.
  - Added the required column `freightCharge` to the `CostBuildUp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mislaneousCost` to the `CostBuildUp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CostBuildUp" DROP CONSTRAINT "CostBuildUp_productId_fkey";

-- AlterTable
ALTER TABLE "CostBuildUp" DROP COLUMN "productId",
DROP COLUMN "seaFreightCharge",
ADD COLUMN     "freightCharge" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mislaneousCost" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "CostBuildUpProduct" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "competitorSellingPrice" DOUBLE PRECISION NOT NULL,
    "sellingPrice" DOUBLE PRECISION,
    "costBuildUpId" INTEGER NOT NULL,

    CONSTRAINT "CostBuildUpProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CostBuildUpProduct_productId_costBuildUpId_key" ON "CostBuildUpProduct"("productId", "costBuildUpId");

-- AddForeignKey
ALTER TABLE "CostBuildUpProduct" ADD CONSTRAINT "CostBuildUpProduct_costBuildUpId_fkey" FOREIGN KEY ("costBuildUpId") REFERENCES "CostBuildUp"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostBuildUpProduct" ADD CONSTRAINT "CostBuildUpProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
