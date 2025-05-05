/*
  Warnings:

  - You are about to drop the column `productId` on the `IODMs` table. All the data in the column will be lost.
  - Added the required column `tinNumber` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "IODMs" DROP CONSTRAINT "IODMs_productId_fkey";

-- AlterTable
ALTER TABLE "IODMs" DROP COLUMN "productId";

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "tinNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "finalizedDate" TIMESTAMP(3),
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "withCredit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "weeks_sales" ALTER COLUMN "actualContacts" SET DEFAULT 0,
ALTER COLUMN "actualVisits" SET DEFAULT 0,
ALTER COLUMN "actualNewCustomers" SET DEFAULT 0,
ALTER COLUMN "actualTransactions" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "CostBuildUp" (
    "id" SERIAL NOT NULL,
    "fobPriceUSD" DOUBLE PRECISION NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "totalFobCostBirr" DOUBLE PRECISION NOT NULL,
    "fcPurchase" DOUBLE PRECISION NOT NULL,
    "bankServiceCharges" DOUBLE PRECISION NOT NULL,
    "insuranceCharge" DOUBLE PRECISION NOT NULL,
    "seaFreightCharge" DOUBLE PRECISION NOT NULL,
    "customsDuty" DOUBLE PRECISION NOT NULL,
    "storageCharges" DOUBLE PRECISION NOT NULL,
    "inlandTransport" DOUBLE PRECISION NOT NULL,
    "transitAgentCharge" DOUBLE PRECISION NOT NULL,
    "loadingUnloadingExpenses" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "usdPurchasePrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "CostBuildUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IODMToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_IODMToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_IODMToProduct_B_index" ON "_IODMToProduct"("B");

-- AddForeignKey
ALTER TABLE "CostBuildUp" ADD CONSTRAINT "CostBuildUp_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IODMToProduct" ADD CONSTRAINT "_IODMToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "IODMs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IODMToProduct" ADD CONSTRAINT "_IODMToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
