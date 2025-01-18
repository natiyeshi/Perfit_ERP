/*
  Warnings:

  - You are about to drop the column `arrivalDatePort` on the `pipelines` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalDateWarehouse` on the `pipelines` table. All the data in the column will be lost.
  - You are about to drop the column `expectedArrivalPort` on the `pipelines` table. All the data in the column will be lost.
  - You are about to drop the column `expectedArrivalWarehouse` on the `pipelines` table. All the data in the column will be lost.
  - Added the required column `portExpectedArrivalDate` to the `pipelines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseExpectedArrivalDate` to the `pipelines` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sales_person_id_fkey";

-- AlterTable
ALTER TABLE "pipelines" DROP COLUMN "arrivalDatePort",
DROP COLUMN "arrivalDateWarehouse",
DROP COLUMN "expectedArrivalPort",
DROP COLUMN "expectedArrivalWarehouse",
ADD COLUMN     "portArrivalDate" TIMESTAMP(3),
ADD COLUMN     "portExpectedArrivalDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "warehouseArrivalDate" TIMESTAMP(3),
ADD COLUMN     "warehouseExpectedArrivalDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "sales_person_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "sales_persons"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
