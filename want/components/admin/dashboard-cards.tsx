import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, DollarSign, CreditCard, AlertCircle } from 'lucide-react'
import { mockInvoices, mockWorkOrders, calculateTotalPaymentsReceived, calculatePendingPayments } from "@/lib/admin-data"

export function DashboardCards() {
  // Calculate statistics
  const totalWorkOrders = mockWorkOrders.length
  const totalInvoiceValue = mockInvoices.reduce((sum, inv) => sum + inv.netPayable, 0)
  const totalPaymentsReceived = calculateTotalPaymentsReceived()
  const pendingPayments = calculatePendingPayments()

  // Count invoice statuses
  const fullyBilled = mockWorkOrders.filter((wo) => wo.billingStatus === "Fully Billed").length
  const partiallyBilled = mockWorkOrders.filter((wo) => wo.billingStatus === "Partially Billed").length
  const notBilled = mockWorkOrders.filter((wo) => wo.billingStatus === "Not Billed").length

  const cards = [
    {
      title: "Total Work Orders",
      value: totalWorkOrders,
      description: `${fullyBilled} Fully Billed • ${partiallyBilled} Partial • ${notBilled} Not Billed`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Total Invoice Value",
      value: `₹${(totalInvoiceValue / 100000).toFixed(1)}L`,
      description: `${mockInvoices.length} invoices generated`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Payments Received",
      value: `₹${(totalPaymentsReceived / 100000).toFixed(1)}L`,
      description: `${((totalPaymentsReceived / totalInvoiceValue) * 100).toFixed(0)}% collection rate`,
      icon: CreditCard,
      color: "text-emerald-600",
    },
    {
      title: "Outstanding Payments",
      value: `₹${(pendingPayments / 100000).toFixed(1)}L`,
      description: `Pending from clients`,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className="rounded-2xl shadow-sm border-0 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-gray-700">{card.title}</CardTitle>
                <Icon className={`${card.color} w-5 h-5`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{card.value}</div>
              <CardDescription className="text-xs text-gray-600">{card.description}</CardDescription>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
