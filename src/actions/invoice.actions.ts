"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: {
  woDate: Date;
  woNumber: string;
  site: string;
  invoiceDate: Date;
  invoiceNo: string;
  client: string;
  billingAmount: number;
  billingIGST: number;
  billingSGST: number;
  totalBillingAmount: number;
  tds: number;
  netPay: number;
  workOrderId: string;
}) {
  try {
    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        remainingAmount: data.netPay,
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
        paymentReceipt: true,
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
        paymentReceipt: true,
      },
    });
    return { success: true, data: invoice };
  } catch (error) {
    return { success: false, error: "Failed to fetch invoice" };
  }
}

export async function updateInvoice(id: string, data: Partial<{
  woDate: Date;
  woNumber: string;
  site: string;
  invoiceDate: Date;
  invoiceNo: string;
  client: string;
  billingAmount: number;
  billingIGST: number;
  billingSGST: number;
  totalBillingAmount: number;
  tds: number;
  netPay: number;
  remainingAmount: number;
  isCompleted: boolean;
  reminderEnabled: boolean;
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

export async function createPaymentReceipt(data: {
  paymentReceived: number;
  paymentMethod: "ONLINE" | "CASH" | "OTHER";
  paymentStatus: "SUCCESS" | "FAILED";
  invoiceId: string;
}) {
  try {
    const paymentReceipt = await prisma.paymentReceipt.create({
      data,
    });
    
    // Update invoice remaining amount
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
    });
    
    if (invoice && data.paymentStatus === "SUCCESS") {
      const newRemainingAmount = invoice.remainingAmount - data.paymentReceived;
      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: {
          remainingAmount: Math.max(0, newRemainingAmount),
          isCompleted: newRemainingAmount <= 0,
        },
      });
    }
    
    revalidatePath("/admin/dashboard");
    return { success: true, data: paymentReceipt };
  } catch (error) {
    return { success: false, error: "Failed to create payment receipt" };
  }
}