/*
  Warnings:

  - You are about to drop the column `product_brand` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the `CompetitorImportData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IODM` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pipeline` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sells` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellsTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Supplier` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `quantity` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('UNKNOWN', 'DATA_AGGREGATOR', 'SALES_PERSON', 'ADMIN');

-- DropForeignKey
ALTER TABLE "CompetitorImportData" DROP CONSTRAINT "CompetitorImportData_productId_fkey";

-- DropForeignKey
ALTER TABLE "CompetitorImportData" DROP CONSTRAINT "CompetitorImportData_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "IODM" DROP CONSTRAINT "IODM_productId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_productId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "Pipeline" DROP CONSTRAINT "Pipeline_productId_fkey";

-- DropForeignKey
ALTER TABLE "SellsTransaction" DROP CONSTRAINT "SellsTransaction_customerId_fkey";

-- DropForeignKey
ALTER TABLE "SellsTransaction" DROP CONSTRAINT "SellsTransaction_sellsId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "product_brand",
DROP COLUMN "product_name",
ALTER COLUMN "quantity" SET NOT NULL;

-- DropTable
DROP TABLE "CompetitorImportData";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "IODM";

-- DropTable
DROP TABLE "Pipeline";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "Sells";

-- DropTable
DROP TABLE "SellsTransaction";

-- DropTable
DROP TABLE "Supplier";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'UNKNOWN',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flag" (
    "userId" TEXT NOT NULL,
    "is_suspended" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "shelf_life" TEXT,
    "brand" TEXT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "country" TEXT,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "country" TEXT,

    CONSTRAINT "competitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_imports" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT,
    "unit_price" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION,
    "order_date" TIMESTAMP(3),
    "shelf_life" TEXT,
    "mode_of_shipment" TEXT,
    "company_name" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT,
    "competiatorId" TEXT NOT NULL,

    CONSTRAINT "competitor_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "label" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "sales_person_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales_persons" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "sales_persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categoies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_categoies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IODMs" (
    "id" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "IODMs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "shipment" TEXT,
    "quantity" INTEGER NOT NULL,
    "invoice_amount" DOUBLE PRECISION NOT NULL,
    "productId" TEXT,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToProductCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProductToProductCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Flag_userId_key" ON "Flag"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_id_key" ON "suppliers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_id_key" ON "competitors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_imports_id_key" ON "competitor_imports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_persons_id_key" ON "sales_persons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_persons_user_id_key" ON "sales_persons"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_categoies_id_key" ON "product_categoies"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IODMs_id_key" ON "IODMs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pipelines_id_key" ON "pipelines"("id");

-- CreateIndex
CREATE INDEX "_ProductToProductCategory_B_index" ON "_ProductToProductCategory"("B");

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_competiatorId_fkey" FOREIGN KEY ("competiatorId") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "sales_persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_persons" ADD CONSTRAINT "sales_persons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IODMs" ADD CONSTRAINT "IODMs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCategory" ADD CONSTRAINT "_ProductToProductCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCategory" ADD CONSTRAINT "_ProductToProductCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "product_categoies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
