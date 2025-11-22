"use client"

import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Payments } from "@/components/admin/tabs/payments"

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-8">Payments</h2>
        <Payments />
      </div>
    </DashboardLayout>
  )
}