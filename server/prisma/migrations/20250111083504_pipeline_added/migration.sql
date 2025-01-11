/*
  Warnings:

  - You are about to drop the column `invoice_amount` on the `pipelines` table. All the data in the column will be lost.
  - You are about to drop the column `shipment` on the `pipelines` table. All the data in the column will be lost.
  - Added the required column `expectedArrivalPort` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedArrivalWarehouse` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoice` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingDate` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingMethod` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Made the column `productId` on table `pipelines` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SHIPPING_METHOD" AS ENUM ('AIR', 'SEA');

-- DropForeignKey
ALTER TABLE "pipelines" DROP CONSTRAINT "pipelines_productId_fkey";

-- AlterTable
ALTER TABLE "pipelines" DROP COLUMN "invoice_amount",
DROP COLUMN "shipment",
ADD COLUMN     "arrivalDatePort" TIMESTAMP(3),
ADD COLUMN     "arrivalDateWarehouse" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expectedArrivalPort" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "expectedArrivalWarehouse" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "openingDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "shippingMethod" "SHIPPING_METHOD" NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
