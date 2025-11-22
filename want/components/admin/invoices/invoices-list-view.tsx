"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FYDropdown } from "@/components/admin/fy-dropdown"
import { mockInvoices } from "@/lib/admin-data"
import { getCurrentFinancialYear } from "@/lib/fy-utils"
import { Plus, Search, Filter, Eye, Download } from 'lucide-react'
import { AddInvoiceModal } from "@/components/admin/modals/add-invoice-modal"

interface InvoicesListViewProps {
  onSelectInvoice: (invoiceNo: string) => void
}

export function InvoicesListView({ onSelectInvoice }: InvoicesListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [clientFilter, setClientFilter] = useState("All")
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredInvoices = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.woNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || inv.paymentStatus === statusFilter
    const matchesClient = clientFilter === "All" || inv.client === clientFilter
    const matchesFY = inv.fy === selectedFY

    return matchesSearch && matchesStatus && matchesClient && matchesFY
  })

  const uniqueClients = Array.from(new Set(mockInvoices.filter((inv) => inv.fy === selectedFY).map((inv) => inv.client)))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Partial":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-blue-100 text-blue-800"
      case "Unpaid":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddInvoice = (data: any) => {
    console.log("[v0] New Invoice:", data)
    // Future: Send to backend API
  }

  return (
    <div className="space-y-6">
      {/* Header with FY Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">{filteredInvoices.length} invoices found</p>
        </div>
        <div className="flex items-center gap-4">
          <FYDropdown value={selectedFY} onChange={setSelectedFY} />
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border border-border/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search invoice, WO, or client..."
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
                <option>Paid</option>
                <option>Partial</option>
                <option>Pending</option>
                <option>Unpaid</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>All</option>
                {uniqueClients.map((client) => (
                  <option key={client}>{client}</option>
                ))}
              </select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download size={18} />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">WO No.</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">GST</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Net Payable</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv, index) => (
                  <tr
                    key={inv.invoiceNo}
                    className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-primary">{inv.invoiceNo}</td>
                    <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{inv.woNo}</td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{inv.client}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{inv.date}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right">₹{inv.invoiceAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right">₹{inv.gst.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-primary">
                      ₹{inv.netPayable.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inv.paymentStatus)}`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectInvoice(inv.invoiceNo)}
                          className="p-1.5 hover:bg-primary/10 rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} className="text-primary" />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded-md transition-colors" title="Download">
                          <Download size={18} className="text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Invoice Modal */}
      <AddInvoiceModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddInvoice} />
    </div>
  )
}
