import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInvoices, mockWorkOrders, mockPayments } from "@/lib/admin-data"

export function SummaryCards() {
  const totalInvoices = mockInvoices.length
  const totalInvoiceAmount = mockInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalWorkOrders = mockWorkOrders.length
  const totalPayments = mockPayments.reduce((sum, payment) => sum + payment.amountReceived, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalInvoices}</div>
          <p className="text-xs text-muted-foreground mt-1">Invoices raised</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoice Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{totalInvoiceAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total value</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalWorkOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Active orders</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Payments Received</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{totalPayments.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total collected</p>
        </CardContent>
      </Card>
    </div>
  )
}
