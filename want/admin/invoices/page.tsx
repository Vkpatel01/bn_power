"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { InvoicesListView } from "@/components/admin/invoices/invoices-list-view"
import { InvoiceDetailView } from "@/components/admin/invoices/invoice-detail-view"

export default function InvoicesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null)

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
      {selectedInvoice ? (
        <InvoiceDetailView invoiceNo={selectedInvoice} onBack={() => setSelectedInvoice(null)} />
      ) : (
        <InvoicesListView onSelectInvoice={setSelectedInvoice} />
      )}
    </DashboardLayout>
  )
}
