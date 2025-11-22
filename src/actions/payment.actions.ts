"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export async function getPayments() {
  try {
    const payments = await prisma.paymentReceived.findMany({
      include: {
        invoice: {
          include: {
            workOrder: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: "Failed to fetch payments" };
  }
}

export async function getPaymentsByInvoice(invoiceId: string) {
  try {
    const payments = await prisma.paymentReceived.findMany({
      where: { invoiceId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: "Failed to fetch payments" };
  }
}

export async function createPaymentReceived(data: {
  invoiceId: string;
  invoiceDate?: Date;
  paymentDate: Date;
  paymentAmount: number;
  paymentMode: PaymentMethod;
  transactionReference?: string;
  remarks?: string;
  paymentStatus?: PaymentStatus;
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
        paymentStatus: data.paymentStatus || PaymentStatus.SUCCESS,
        balanceAfterPayment: Math.max(0, balanceAfterPayment),
      },
    });
    
    // Update invoice remaining amount if payment is successful
    if (data.paymentStatus !== PaymentStatus.FAILED) {
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

export async function updatePaymentReceived(id: string, data: Partial<{
  paymentDate: Date;
  paymentAmount: number;
  paymentMode: PaymentMethod;
  transactionReference: string;
  remarks: string;
  paymentStatus: PaymentStatus;
}>) {
  try {
    const payment = await prisma.paymentReceived.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: payment };
  } catch (error) {
    return { success: false, error: "Failed to update payment" };
  }
}

export async function deletePaymentReceived(id: string) {
  try {
    // Get payment details before deletion to update invoice
    const payment = await prisma.paymentReceived.findUnique({
      where: { id },
      include: { invoice: true },
    });
    
    if (!payment) {
      return { success: false, error: "Payment not found" };
    }
    
    // Delete payment
    await prisma.paymentReceived.delete({
      where: { id },
    });
    
    // Recalculate invoice remaining amount
    const remainingPayments = await prisma.paymentReceived.findMany({
      where: { 
        invoiceId: payment.invoiceId,
        paymentStatus: PaymentStatus.SUCCESS,
      },
    });
    
    const totalPaid = remainingPayments.reduce((sum, p) => sum + p.paymentAmount, 0);
    const newRemainingAmount = payment.invoice.netPayAmount - totalPaid;
    
    await prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        remainingAmount: Math.max(0, newRemainingAmount),
      },
    });
    
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete payment" };
  }
}