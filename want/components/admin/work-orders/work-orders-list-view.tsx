"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FYDropdown } from "@/components/admin/fy-dropdown"
import { mockWorkOrders, mockInvoices } from "@/lib/admin-data"
import { getCurrentFinancialYear } from "@/lib/fy-utils"
import { Plus, Search, Filter, Eye, Edit2, FileText } from 'lucide-react'
import { AddWorkOrderModal } from "@/components/admin/modals/add-work-order-modal"

interface WorkOrdersListViewProps {
  onSelectWO: (woNo: string) => void
}

export function WorkOrdersListView({ onSelectWO }: WorkOrdersListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredWorkOrders = mockWorkOrders.filter((wo) => {
    const matchesSearch =
      wo.woNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wo.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || wo.status === statusFilter
    const matchesFY = wo.fy === selectedFY

    return matchesSearch && matchesStatus && matchesFY
  })

  const getBillingStatus = (woNo: string) => {
    const invoices = mockInvoices.filter((inv) => inv.woNo === woNo)
    const totalBilled = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const wo = mockWorkOrders.find((w) => w.woNo === woNo)
    if (!wo) return { status: "Not Billed", percentage: 0 }

    const percentage = (totalBilled / wo.value) * 100
    if (percentage === 0) return { status: "Not Billed", color: "bg-red-100 text-red-800", percentage: 0 }
    if (percentage >= 100) return { status: "Fully Billed", color: "bg-green-100 text-green-800", percentage: 100 }
    return { status: "Partially Billed", color: "bg-yellow-100 text-yellow-800", percentage }
  }

  const handleAddWorkOrder = (data: any) => {
    console.log("[v0] New Work Order:", data)
    // Future: Send to backend API
  }

  return (
    <div className="space-y-6">
      {/* Header with FY Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredWorkOrders.length} work orders found</p>
        </div>
        <div className="flex items-center gap-4">
          <FYDropdown value={selectedFY} onChange={setSelectedFY} />
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Create New WO
          </Button>
        </div>
      </div>

      {/* Modal Component */}
      <AddWorkOrderModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddWorkOrder} />

      {/* Search and Filter Bar */}
      <Card className="border border-border/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by WO number or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>All</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Orders Table */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">WO No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Client Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Site</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Billing Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoices</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkOrders.map((wo, index) => {
                  const billing = getBillingStatus(wo.woNo)
                  const invoiceCount = mockInvoices.filter((inv) => inv.woNo === wo.woNo).length
                  return (
                    <tr
                      key={wo.woNo}
                      className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-primary">{wo.woNo}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{wo.client}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">-</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">₹{wo.value.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${billing.color}`}>
                          {billing.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-primary">{invoiceCount}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            wo.status === "Active"
                              ? "bg-blue-100 text-blue-800"
                              : wo.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {wo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectWO(wo.woNo)}
                            className="p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                            title="View Details"
                          >
                            <Eye size={18} className="text-primary" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Edit">
                            <Edit2 size={18} className="text-muted-foreground" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Create Invoice">
                            <FileText size={18} className="text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
