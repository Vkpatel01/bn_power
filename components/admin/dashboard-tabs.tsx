"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { InvoiceGenerator } from "./tabs/invoice-generator"
import { AllInvoices } from "./tabs/all-invoices"
import { WorkOrders } from "./tabs/work-orders"
import { Payments } from "./tabs/payments"

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState("invoices")

  const tabs = [
    { id: "invoices", label: "Invoice Generator" },
    { id: "all-invoices", label: "All Invoices" },
    { id: "work-orders", label: "Work Orders" },
    { id: "payments", label: "Payments" },
  ]

  return (
    <Card className="shadow-lg">
      <div className="border-b flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-b-primary text-primary"
                : "border-b-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "invoices" && <InvoiceGenerator />}
        {activeTab === "all-invoices" && <AllInvoices />}
        {activeTab === "work-orders" && <WorkOrders />}
        {activeTab === "payments" && <Payments />}
      </div>
    </Card>
  )
}
