"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: {
  invoiceNo: string;
  workOrderId: string;
  invoiceDate: Date;
  billingAmount: number;
  taxType?: string;
  igstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  totalBillingAmount: number;
  tdsAmount?: number;
  netPayAmount: number;
  remarks?: string;
}) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        igstAmount: data.igstAmount || 0,
        cgstAmount: data.cgstAmount || 0,
        sgstAmount: data.sgstAmount || 0,
        tdsAmount: data.tdsAmount || 0,
        remainingAmount: data.netPayAmount,
      },
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to create invoice" };
  }
}

export async function getInvoices() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        workOrder: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: invoices };
  } catch (error) {
    return { success: false, error: "Failed to fetch invoices" };
  }
}

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        workOrder: true,
        payments: true,
      },
    });
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to fetch invoice" };
  }
}

export async function updateInvoice(id: string, data: Partial<{
  invoiceNo: string;
  invoiceDate: Date;
  billingAmount: number;
  taxType: string;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalBillingAmount: number;
  tdsAmount: number;
  netPayAmount: number;
  remainingAmount: number;
  remarks: string;
}>) {
  try {
    const invoice = await prisma.invoice.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to update invoice" };
  }
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete invoice" };
  }
}

export async function createPaymentReceived(data: {
  invoiceId: string;
  invoiceDate?: Date;
  paymentDate: Date;
  paymentAmount: number;
  paymentMode: "ONLINE" | "CASH" | "OTHER";
  transactionReference?: string;
  remarks?: string;
  paymentStatus?: "SUCCESS" | "FAILED";
}) {
  try {
    // Get current invoice to calculate balance
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    });
    
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }
    
    const balanceAfterPayment = invoice.remainingAmount - data.paymentAmount;
    
    const paymentReceived = await prisma.paymentReceived.create({
      data: {
        ...data,
        paymentStatus: data.paymentStatus || "SUCCESS",
        balanceAfterPayment: Math.max(0, balanceAfterPayment),
      },
    });
    
    // Update invoice remaining amount if payment is successful
    if (data.paymentStatus !== "FAILED") {
      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          remainingAmount: Math.max(0, balanceAfterPayment),
        },
      });
    }
    
    revalidatePath("/admin/dashboard");
    return { success: true, data: paymentReceived };
  } catch (error) {
    return { success: false, error: "Failed to create payment record" };
  }
}