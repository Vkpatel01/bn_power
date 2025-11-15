"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createWorkOrder(data: {
  workOrderNumber: string;
  clientName: string;
  GSTIN?: string;
  workOrderDate: Date;
  workDescription: string;
  amount: number;
  GST: number;
  totalAmount: number;
  userId?: string;
}) {
  try {
    const workOrder = await prisma.workOrder.create({
      data: {
        ...data,
        remainingAmount: data.totalAmount,
      },
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: workOrder };
  } catch (error) {
    return { success: false, error: "Failed to create work order" };
  }
}

export async function getWorkOrders() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        invoices: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: workOrders };
  } catch (error) {
    return { success: false, error: "Failed to fetch work orders" };
  }
}

export async function getWorkOrderById(id: string) {
  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        invoices: {
          include: {
            paymentReceipt: true,
          },
        },
        user: true,
      },
    });
    return { success: true, data: workOrder };
  } catch (error) {
    return { success: false, error: "Failed to fetch work order" };
  }
}

export async function updateWorkOrder(id: string, data: Partial<{
  workOrderNumber: string;
  clientName: string;
  GSTIN: string;
  workOrderDate: Date;
  workDescription: string;
  amount: number;
  GST: number;
  totalAmount: number;
  remainingAmount: number;
  isCompleted: boolean;
}>) {
  try {
    const workOrder = await prisma.workOrder.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/dashboard");
    return { success: true, data: workOrder };
  } catch (error) {
    return { success: false, error: "Failed to update work order" };
  }
}

export async function deleteWorkOrder(id: string) {
  try {
    await prisma.workOrder.delete({
      where: { id },
    });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete work order" };
  }
}