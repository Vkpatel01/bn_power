"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/admin/dashboard-header"
import { SummaryCards } from "@/components/admin/summary-cards"
import { DashboardTabs } from "@/components/admin/dashboard-tabs"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { DashboardCards } from "@/components/admin/dashboard-cards"
import { AnalyticsSection } from "@/components/admin/analytics-section"
import { AlertsSection } from "@/components/admin/alerts-section"
import { RecentActivityTable } from "@/components/admin/recent-activity-table"

export default function AdminDashboard() {
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

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated")
    sessionStorage.removeItem("adminEmail")
    router.push("/admin/login")
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>

        {/* Summary Cards */}
        <DashboardCards />

        {/* Analytics Charts */}
        <AnalyticsSection />

        {/* Alerts Section */}
        <AlertsSection />

        {/* Recent Activity Table */}
        <RecentActivityTable />
      </div>
    </DashboardLayout>
  )
}
