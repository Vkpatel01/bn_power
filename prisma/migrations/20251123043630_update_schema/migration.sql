-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'CASH', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "workOrderNumber" TEXT NOT NULL,
    "workOrderDate" TIMESTAMP(3) NOT NULL,
    "clientName" TEXT NOT NULL,
    "location" TEXT,
    "workDescription" TEXT NOT NULL,
    "billAmount" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "workOrderId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "billingAmount" DOUBLE PRECISION NOT NULL,
    "taxType" TEXT,
    "igstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalBillingAmount" DOUBLE PRECISION NOT NULL,
    "tdsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netPayAmount" DOUBLE PRECISION NOT NULL,
    "remainingAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentReceived" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3),
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "paymentMode" "PaymentMethod" NOT NULL,
    "transactionReference" TEXT,
    "balanceAfterPayment" DOUBLE PRECISION NOT NULL,
    "remarks" TEXT,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'SUCCESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentReceived_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "WorkOrder_workOrderNumber_key" ON "WorkOrder"("workOrderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNo_key" ON "Invoice"("invoiceNo");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReceived" ADD CONSTRAINT "PaymentReceived_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
