/*
  Warnings:

  - Added the required column `bsc` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cbm` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_selling_price` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dutyTax` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchange_rate` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry_date` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `freight_cost` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gross_weight` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loading_unloading` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer_date` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_movement` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purchase_price_usd` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transport_cost` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `IODMs` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `IODMs` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MOVEMENT" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- DropForeignKey
ALTER TABLE "IODMs" DROP CONSTRAINT "IODMs_productId_fkey";

-- AlterTable
ALTER TABLE "IODMs" ADD COLUMN     "bsc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "cbm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_selling_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "dutyTax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "exchange_rate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "expiry_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "freight_cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gross_weight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "loading_unloading" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "manufacturer_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "product_movement" "MOVEMENT" NOT NULL,
ADD COLUMN     "purchase_price_usd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "supplierId" TEXT NOT NULL,
ADD COLUMN     "transport_cost" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "IODMs" ADD CONSTRAINT "IODMs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IODMs" ADD CONSTRAINT "IODMs_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
