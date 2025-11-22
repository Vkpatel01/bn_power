"use client"

import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { WorkOrders } from "@/components/admin/tabs/work-orders"

export default function WorkOrdersPage() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-8">Work Orders</h2>
        <WorkOrders />
      </div>
    </DashboardLayout>
  )
}