"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const [
      totalWorkOrders,
      completedWorkOrders,
      totalInvoices,
      completedInvoices,
      totalRevenue,
      pendingAmount,
    ] = await Promise.all([
      prisma.workOrder.count(),
      prisma.workOrder.count({ where: { isCompleted: true } }),
      prisma.invoice.count(),
      prisma.invoice.count({ where: { isCompleted: true } }),
      prisma.invoice.aggregate({
        _sum: { totalBillingAmount: true },
      }),
      prisma.invoice.aggregate({
        _sum: { remainingAmount: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalWorkOrders,
        completedWorkOrders,
        pendingWorkOrders: totalWorkOrders - completedWorkOrders,
        totalInvoices,
        completedInvoices,
        pendingInvoices: totalInvoices - completedInvoices,
        totalRevenue: totalRevenue._sum.totalBillingAmount || 0,
        pendingAmount: pendingAmount._sum.remainingAmount || 0,
        collectedAmount: (totalRevenue._sum.totalBillingAmount || 0) - (pendingAmount._sum.remainingAmount || 0),
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch dashboard stats" };
  }
}

export async function getRecentActivities() {
  try {
    const [recentWorkOrders, recentInvoices, recentPayments] = await Promise.all([
      prisma.workOrder.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          workOrderNumber: true,
          clientName: true,
          totalAmount: true,
          createdAt: true,
        },
      }),
      prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          invoiceNo: true,
          client: true,
          totalBillingAmount: true,
          createdAt: true,
        },
      }),
      prisma.paymentReceipt.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          invoice: {
            select: {
              invoiceNo: true,
              client: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        recentWorkOrders,
        recentInvoices,
        recentPayments,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch recent activities" };
  }
}

export async function getMonthlyRevenue() {
  try {
    const monthlyData = await prisma.invoice.groupBy({
      by: ["invoiceDate"],
      _sum: {
        totalBillingAmount: true,
      },
      orderBy: {
        invoiceDate: "asc",
      },
    });

    // Group by month
    const monthlyRevenue = monthlyData.reduce((acc, item) => {
      const month = new Date(item.invoiceDate).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + (item._sum.totalBillingAmount || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      success: true,
      data: monthlyRevenue,
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch monthly revenue" };
  }
}