/*
  Warnings:

  - You are about to drop the column `cbm` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `current_selling_price` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `freight_cost` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `gross_weight` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `product_movement` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `purchase_price_usd` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `shipment_amount` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `transport_cost` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the `_IODMToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_IODMToProduct" DROP CONSTRAINT "_IODMToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_IODMToProduct" DROP CONSTRAINT "_IODMToProduct_B_fkey";

-- AlterTable
ALTER TABLE "IODMs" DROP COLUMN "cbm",
DROP COLUMN "current_selling_price",
DROP COLUMN "freight_cost",
DROP COLUMN "gross_weight",
DROP COLUMN "product_movement",
DROP COLUMN "purchase_price_usd",
DROP COLUMN "shipment_amount",
DROP COLUMN "transport_cost";

-- DropTable
DROP TABLE "_IODMToProduct";

-- CreateTable
CREATE TABLE "IODMProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "purchase_price_usd" DOUBLE PRECISION NOT NULL,
    "current_selling_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "product_movement" "MOVEMENT" NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "manufacture_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "IODM_id" TEXT NOT NULL,

    CONSTRAINT "IODMProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "IODMProduct_id_key" ON "IODMProduct"("id");

-- AddForeignKey
ALTER TABLE "IODMProduct" ADD CONSTRAINT "IODMProduct_IODM_id_fkey" FOREIGN KEY ("IODM_id") REFERENCES "IODMs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
