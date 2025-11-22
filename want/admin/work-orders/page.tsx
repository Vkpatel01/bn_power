"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { WorkOrdersListView } from "@/components/admin/work-orders/work-orders-list-view"
import { WorkOrderDetailView } from "@/components/admin/work-orders/work-order-detail-view"

export default function WorkOrdersPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedWO, setSelectedWO] = useState<string | null>(null)

  useEffect(() => {
    const authenticated = sessionStorage.getItem("isAdminAuthenticated")
    if (!authenticated) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      setIsLoading(false)
    }
  }, [router])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      {selectedWO ? (
        <WorkOrderDetailView woNo={selectedWO} onBack={() => setSelectedWO(null)} />
      ) : (
        <WorkOrdersListView onSelectWO={setSelectedWO} />
      )}
    </DashboardLayout>
  )
}
