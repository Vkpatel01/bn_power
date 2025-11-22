"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { PaymentsListView } from "@/components/admin/payments/payments-list-view"

export default function PaymentsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      <PaymentsListView />
    </DashboardLayout>
  )
}
