"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockInvoices, mockWorkOrders } from "@/lib/admin-data"
import { ArrowLeft, Download, Plus } from 'lucide-react'

interface InvoiceDetailViewProps {
  invoiceNo: string
  onBack: () => void
}

export function InvoiceDetailView({ invoiceNo, onBack }: InvoiceDetailViewProps) {
  const invoice = mockInvoices.find((inv) => inv.invoiceNo === invoiceNo)
  const workOrder = mockWorkOrders.find((wo) => wo.woNo === invoice?.woNo)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  if (!invoice || !workOrder) {
    return <div>Invoice not found</div>
  }

  const balanceRemaining = invoice.netPayable - invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          <ArrowLeft size={24} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{invoice.invoiceNo}</h1>
          <p className="text-sm text-muted-foreground mt-1">Issued on {invoice.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Invoice Number</p>
                  <p className="text-sm font-semibold text-foreground">{invoice.invoiceNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Work Order</p>
                  <p className="text-sm font-semibold text-primary">{invoice.woNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Invoice Date</p>
                  <p className="text-sm font-semibold text-foreground">{invoice.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="text-sm font-semibold text-foreground">{invoice.dueDate}</p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground mb-1">Client</p>
                <p className="text-sm font-semibold text-foreground">{invoice.client}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Invoice Amount Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Invoice Amount</p>
                  <p className="text-sm font-semibold">₹{invoice.invoiceAmount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">GST (18%)</p>
                  <p className="text-sm font-semibold">₹{invoice.gst.toLocaleString()}</p>
                </div>
                <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                  <p className="text-sm font-semibold">Net Payable</p>
                  <p className="text-lg font-bold text-primary">₹{invoice.netPayable.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {invoice.paymentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 font-semibold text-foreground">Date</th>
                        <th className="text-left py-2 font-semibold text-foreground">Amount</th>
                        <th className="text-left py-2 font-semibold text-foreground">Mode</th>
                        <th className="text-left py-2 font-semibold text-foreground">Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.paymentHistory.map((payment, idx) => (
                        <tr key={idx} className="border-b border-border/30 hover:bg-muted/30">
                          <td className="py-3 text-muted-foreground">{payment.date}</td>
                          <td className="py-3 font-semibold">₹{payment.amount.toLocaleString()}</td>
                          <td className="py-3">{payment.mode}</td>
                          <td className="py-3 font-mono text-xs">{payment.reference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="border border-border/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Invoiced</p>
                <p className="text-2xl font-bold text-foreground">₹{invoice.netPayable.toLocaleString()}</p>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground mb-1">Amount Received</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{invoice.paymentHistory.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </p>
              </div>
              <div className="border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground mb-1">Balance Remaining</p>
                <p className={`text-2xl font-bold ${balanceRemaining > 0 ? "text-red-600" : "text-green-600"}`}>
                  ₹{balanceRemaining.toLocaleString()}
                </p>
              </div>

              <div className="border-t border-border/50 pt-4">
                <div className="w-full bg-border rounded-full h-2 mb-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${((invoice.netPayable - balanceRemaining) / invoice.netPayable) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {((invoice.netPayable - balanceRemaining) / invoice.netPayable * 100).toFixed(0)}% paid
                </p>
              </div>

              {balanceRemaining > 0 && (
                <Button onClick={() => setShowPaymentForm(!showPaymentForm)} className="w-full gap-2 mt-4">
                  <Plus size={18} />
                  Add Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {showPaymentForm && (
            <Card className="border border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Record Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Amount (₹)</label>
                  <Input type="number" placeholder={balanceRemaining.toString()} max={balanceRemaining} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Mode</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>NEFT</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Reference No.</label>
                  <Input placeholder="e.g., TXN-001, CHQ-5001" />
                </div>
                <Button className="w-full">Record Payment</Button>
              </CardContent>
            </Card>
          )}

          <Button variant="outline" className="w-full gap-2">
            <Download size={18} />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
