/*
  Warnings:

  - You are about to drop the column `competiatorId` on the `competitor_imports` table. All the data in the column will be lost.
  - Added the required column `competitorId` to the `competitor_imports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "competitor_imports" DROP CONSTRAINT "competitor_imports_competiatorId_fkey";

-- AlterTable
ALTER TABLE "competitor_imports" DROP COLUMN "competiatorId",
ADD COLUMN     "competitorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
