"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FYDropdown } from "@/components/admin/fy-dropdown"
import { mockPayments, calculateTotalPaymentsReceived, calculatePendingPayments } from "@/lib/admin-data"
import { getCurrentFinancialYear } from "@/lib/fy-utils"
import { Search, Filter, Download, Eye, Plus } from 'lucide-react'
import { AddPaymentModal } from "@/components/admin/modals/add-payment-modal"

export function PaymentsListView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [modeFilter, setModeFilter] = useState("All")
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch = payment.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMode = modeFilter === "All" || payment.modeOfPayment === modeFilter
    const matchesFY = payment.fy === selectedFY

    return matchesSearch && matchesMode && matchesFY
  })

  const uniqueModes = Array.from(new Set(mockPayments.filter((p) => p.fy === selectedFY).map((p) => p.modeOfPayment).filter((m) => m !== "-")))
  const totalReceived = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0)
  const pendingPayments = filteredPayments.reduce((sum, p) => sum + p.balanceRemaining, 0)

  const handleAddPayment = (data: any) => {
    console.log("[v0] New Payment:", data)
    // Future: Send to backend API
  }

  return (
    <div className="space-y-6">
      {/* Header with FY Dropdown */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments Received</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all payments from clients</p>
        </div>
        <div className="flex items-center gap-4">
          <FYDropdown value={selectedFY} onChange={setSelectedFY} />
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Total Payments Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹{(totalReceived / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground mt-2">{filteredPayments.filter((p) => p.paidAmount > 0).length} payments recorded</p>
          </CardContent>
        </Card>
        <Card className="border border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">₹{(pendingPayments / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground mt-2">{filteredPayments.filter((p) => p.balanceRemaining > 0).length} invoices awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border border-border/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search by invoice number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>All</option>
                {uniqueModes.map((mode) => (
                  <option key={mode}>{mode}</option>
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

      {/* Payments Table */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice No.</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Date</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Paid Amount</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Balance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reference</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment, index) => (
                  <tr
                    key={payment.invoiceNo}
                    className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-primary">{payment.invoiceNo}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.invoiceDate}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.paymentDate}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-green-600">
                      ₹{payment.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-red-600">
                      ₹{payment.balanceRemaining.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">{payment.modeOfPayment}</td>
                    <td className="px-6 py-4 text-sm font-mono text-xs text-muted-foreground">{payment.referenceNo}</td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 hover:bg-primary/10 rounded-md transition-colors" title="View Details">
                        <Eye size={18} className="text-primary" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Modal */}
      <AddPaymentModal open={isModalOpen} onOpenChange={setIsModalOpen} onSubmit={handleAddPayment} />
    </div>
  )
}
