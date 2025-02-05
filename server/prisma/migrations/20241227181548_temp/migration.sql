-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('UNKNOWN', 'DATA_AGGREGATOR', 'SALES_PERSON', 'ADMIN');

-- CreateEnum
CREATE TYPE "CUSTOMER_LABEL" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL DEFAULT 'UNKNOWN',

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
    "shelf_life" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

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
    "unit_price" DOUBLE PRECISION NOT NULL,
    "order_date" TIMESTAMP(3) NOT NULL,
    "mode_of_shipment" TEXT,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "competitorId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imports" (
    "id" TEXT NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "mode_of_shipment" TEXT,
    "order_date" TIMESTAMP(3) NOT NULL,
    "supplierId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "label" "CUSTOMER_LABEL" NOT NULL DEFAULT 'F',

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "customer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sales_person_id" TEXT NOT NULL,
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
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_id_key" ON "suppliers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_email_key" ON "suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_id_key" ON "competitors"("id");

-- CreateIndex
CREATE UNIQUE INDEX "competitors_email_key" ON "competitors"("email");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_imports_id_key" ON "competitor_imports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_imports_productId_key" ON "competitor_imports"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_id_key" ON "Inventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productId_key" ON "Inventory"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "imports_id_key" ON "imports"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customers_id_key" ON "customers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_id_key" ON "transactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_persons_id_key" ON "sales_persons"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_persons_user_id_key" ON "sales_persons"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "IODMs_id_key" ON "IODMs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pipelines_id_key" ON "pipelines"("id");

-- AddForeignKey
ALTER TABLE "Flag" ADD CONSTRAINT "Flag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_imports" ADD CONSTRAINT "competitor_imports_competitorId_fkey" FOREIGN KEY ("competitorId") REFERENCES "competitors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imports" ADD CONSTRAINT "imports_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imports" ADD CONSTRAINT "imports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sales_person_id_fkey" FOREIGN KEY ("sales_person_id") REFERENCES "sales_persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_persons" ADD CONSTRAINT "sales_persons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IODMs" ADD CONSTRAINT "IODMs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
