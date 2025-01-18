/*
  Warnings:

  - You are about to drop the column `salesPersonUserId` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_salesPersonUserId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_sales_person_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "salesPersonUserId";

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "sales_persons"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
