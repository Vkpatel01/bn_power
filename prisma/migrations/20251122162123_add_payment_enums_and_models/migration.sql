/*
  Warnings:

  - You are about to drop the column `billingIGST` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `billingSGST` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `client` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `netPay` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `reminderEnabled` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `tds` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `woDate` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `woNumber` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `GST` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `GSTIN` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `WorkOrder` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentReceipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `netPayAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billAmount` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gstAmount` to the `WorkOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentReceipt" DROP CONSTRAINT "PaymentReceipt_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkOrder" DROP CONSTRAINT "WorkOrder_userId_fkey";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "billingIGST",
DROP COLUMN "billingSGST",
DROP COLUMN "client",
DROP COLUMN "isCompleted",
DROP COLUMN "netPay",
DROP COLUMN "reminderEnabled",
DROP COLUMN "site",
DROP COLUMN "tds",
DROP COLUMN "woDate",
DROP COLUMN "woNumber",
ADD COLUMN     "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "igstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "netPayAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "taxType" TEXT,
ADD COLUMN     "tdsAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WorkOrder" DROP COLUMN "GST",
DROP COLUMN "GSTIN",
DROP COLUMN "amount",
DROP COLUMN "isCompleted",
DROP COLUMN "userId",
ADD COLUMN     "billAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "gstAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "PaymentReceipt";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

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

-- AddForeignKey
ALTER TABLE "PaymentReceived" ADD CONSTRAINT "PaymentReceived_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
