"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { AllInvoices } from "@/components/admin/tabs/all-invoices"
import { InvoiceGenerator } from "@/components/admin/tabs/invoice-generator"
import { Button } from "@/components/ui/button"

export default function InvoicesPage() {
  const [activeTab, setActiveTab] = useState<"list" | "generate">("list")

  return (
    <DashboardLayout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Invoices</h2>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "list" ? "default" : "outline"}
              onClick={() => setActiveTab("list")}
            >
              All Invoices
            </Button>
            <Button
              variant={activeTab === "generate" ? "default" : "outline"}
              onClick={() => setActiveTab("generate")}
            >
              Generate Invoice
            </Button>
          </div>
        </div>
        
        {activeTab === "list" ? <AllInvoices /> : <InvoiceGenerator />}
      </div>
    </DashboardLayout>
  )
}