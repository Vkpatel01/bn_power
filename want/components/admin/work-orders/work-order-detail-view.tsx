"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockWorkOrders, mockInvoices } from "@/lib/admin-data"
import { ArrowLeft, Edit2, Plus, Download } from 'lucide-react'

interface WorkOrderDetailViewProps {
  woNo: string
  onBack: () => void
}

export function WorkOrderDetailView({ woNo, onBack }: WorkOrderDetailViewProps) {
  const workOrder = mockWorkOrders.find((wo) => wo.woNo === woNo)
  const linkedInvoices = mockInvoices.filter((inv) => inv.woNo === woNo)

  if (!workOrder) {
    return <div>Work order not found</div>
  }

  const totalBilled = linkedInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const billingPercentage = (totalBilled / workOrder.value) * 100

  const getProgressColor = () => {
    if (billingPercentage > 75) return "bg-green-500"
    if (billingPercentage >= 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPaymentStatus = (invoice: typeof mockInvoices[0]) => {
    const payment = mockInvoices.find((inv) => inv.invoiceNo === invoice.invoiceNo)
    return payment?.status || "Pending"
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 pb-4 border-b border-border/50">
        <Button variant="outline" size="icon" onClick={onBack} className="gap-2">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Work Order Details</h1>
          <p className="text-sm text-muted-foreground mt-1">{woNo}</p>
        </div>
      </div>

      {/* Work Order Information Card */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Work Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Work Order No</p>
                <p className="text-lg font-bold text-primary mt-1">{workOrder.woNo}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client Name</p>
                <p className="text-base font-semibold text-foreground mt-1">{workOrder.client}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Work Order Value</p>
                <p className="text-base font-bold text-foreground mt-1">₹{workOrder.value.toLocaleString()}</p>
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</p>
                <p className="text-base font-semibold text-foreground mt-1">{workOrder.startDate}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">End Date</p>
                <p className="text-base font-semibold text-foreground mt-1">{workOrder.endDate}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                    workOrder.status === "Active"
                      ? "bg-blue-100 text-blue-800"
                      : workOrder.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {workOrder.status}
                </span>
              </div>
            </div>

            {/* Right Column - Billing Progress */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Billing Completed</p>
                <p className="text-3xl font-bold text-primary mt-1">{Math.round(billingPercentage)}%</p>
              </div>
              <div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor()} transition-all duration-500`}
                    style={{ width: `${Math.min(billingPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ₹{totalBilled.toLocaleString()} / ₹{workOrder.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Linked Invoices</CardTitle>
            <CardDescription>{linkedInvoices.length} invoices</CardDescription>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus size={18} />
            Create Invoice
          </Button>
        </CardHeader>
        <CardContent>
          {linkedInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/40">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Invoice No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Payment Received</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {linkedInvoices.map((invoice, index) => (
                    <tr
                      key={invoice.invoiceNo}
                      className={`border-b border-border/30 transition-colors hover:bg-muted/30 ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/10"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-primary">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{invoice.date}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">₹{invoice.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        <span className="font-semibold">₹{(invoice.total * 0.5).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Partial"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:underline text-sm font-medium">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No invoices linked to this work order yet</p>
              <Button className="gap-2 mt-4 bg-primary hover:bg-primary/90">
                <Plus size={18} />
                Create First Invoice
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button variant="outline" className="gap-2">
          <Edit2 size={18} />
          Edit Work Order
        </Button>
        <Button variant="outline" className="gap-2">
          <Download size={18} />
          Download PDF
        </Button>
      </div>
    </div>
  )
}
