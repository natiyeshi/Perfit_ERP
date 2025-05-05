/*
  Warnings:

  - You are about to drop the column `miscellaneousTaxes` on the `IODMs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IODMs" DROP COLUMN "miscellaneousTaxes",
ADD COLUMN     "miscellaneousTax" DOUBLE PRECISION NOT NULL DEFAULT 0.0;
