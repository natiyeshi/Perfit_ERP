/*
  Warnings:

  - You are about to drop the column `freightCost` on the `IODMProduct` table. All the data in the column will be lost.
  - You are about to drop the column `miscellaneousTaxes` on the `IODMProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IODMProduct" DROP COLUMN "freightCost",
DROP COLUMN "miscellaneousTaxes";

-- AlterTable
ALTER TABLE "IODMs" ADD COLUMN     "freightCost" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "miscellaneousTaxes" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
