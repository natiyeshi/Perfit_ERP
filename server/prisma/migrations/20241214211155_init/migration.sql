-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "brand" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "country" TEXT,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompetitorImportData" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER,
    "unit" TEXT,
    "unit_price" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION,
    "order_date" TIMESTAMP(3),
    "shelf_life" TEXT,
    "mode_of_shipment" TEXT,
    "product_name" TEXT,
    "product_brand" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "company_name" TEXT,
    "productId" TEXT,
    "supplierId" TEXT,

    CONSTRAINT "CompetitorImportData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER,
    "unit" TEXT,
    "unit_price" DOUBLE PRECISION,
    "total_price" DOUBLE PRECISION,
    "order_date" TIMESTAMP(3),
    "shelf_life" TIMESTAMP(3),
    "mode_of_shipment" TEXT,
    "product_name" TEXT,
    "product_brand" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT,
    "supplierId" TEXT,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "label" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellsTransaction" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER,
    "total_price" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3),
    "customerId" TEXT,
    "sellsId" TEXT,

    CONSTRAINT "SellsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sells" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Sells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IODM" (
    "id" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "IODM_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pipeline" (
    "id" TEXT NOT NULL,
    "shipment" TEXT,
    "quantity" INTEGER,
    "invoice_amount" DOUBLE PRECISION,
    "productId" TEXT,

    CONSTRAINT "Pipeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_id_key" ON "Supplier"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CompetitorImportData_id_key" ON "CompetitorImportData"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_id_key" ON "Inventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SellsTransaction_id_key" ON "SellsTransaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Sells_id_key" ON "Sells"("id");

-- CreateIndex
CREATE UNIQUE INDEX "IODM_id_key" ON "IODM"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Pipeline_id_key" ON "Pipeline"("id");

-- AddForeignKey
ALTER TABLE "CompetitorImportData" ADD CONSTRAINT "CompetitorImportData_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitorImportData" ADD CONSTRAINT "CompetitorImportData_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellsTransaction" ADD CONSTRAINT "SellsTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellsTransaction" ADD CONSTRAINT "SellsTransaction_sellsId_fkey" FOREIGN KEY ("sellsId") REFERENCES "Sells"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IODM" ADD CONSTRAINT "IODM_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pipeline" ADD CONSTRAINT "Pipeline_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
