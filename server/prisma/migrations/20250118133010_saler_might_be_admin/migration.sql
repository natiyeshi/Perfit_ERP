/*
  Warnings:

  - You are about to drop the column `adminId` on the `transactions` table. All the data in the column will be lost.
  - Made the column `sales_person_id` on table `transactions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_adminId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sales_person_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "adminId",
ADD COLUMN     "salesPersonUserId" TEXT,
ALTER COLUMN "sales_person_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_salesPersonUserId_fkey" FOREIGN KEY ("salesPersonUserId") REFERENCES "sales_persons"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
