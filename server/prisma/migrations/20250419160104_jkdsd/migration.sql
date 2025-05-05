/*
  Warnings:

  - You are about to drop the column `expiry_date` on the `IODMs` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_date` on the `IODMs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IODMs" DROP COLUMN "expiry_date",
DROP COLUMN "manufacturer_date";
