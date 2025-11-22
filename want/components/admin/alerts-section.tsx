import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Clock, FileQuestion } from 'lucide-react'
import { mockInvoices, mockPayments } from "@/lib/admin-data"

export function AlertsSection() {
  // Get pending invoices
  const pendingInvoices = mockInvoices.filter((inv) => inv.status === "Pending" || inv.status === "Unpaid")

  // Get overdue payments
  const overduePayments = mockPayments.filter((pay) => pay.balance > 0)

  // Get work orders without recent invoices
  const workOrdersWithoutInvoices = []

  const alerts = [
    ...pendingInvoices.slice(0, 2).map((inv) => ({
      type: "invoice",
      title: "Pending Invoice",
      description: `${inv.invoiceNo} from ${inv.client} - ₹${(inv.total / 100000).toFixed(1)}L`,
      icon: AlertCircle,
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-800",
    })),
    ...overduePayments.slice(0, 2).map((pay) => ({
      type: "payment",
      title: "Overdue Payment",
      description: `${pay.invoiceNo} - ₹${(pay.balance / 100000).toFixed(1)}L outstanding`,
      icon: Clock,
      color: "bg-red-50 border-red-200",
      textColor: "text-red-800",
    })),
  ]

  return (
    <Card className="rounded-2xl shadow-sm border-0 mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Alerts & Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-sm">No active alerts</p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, idx) => {
              const Icon = alert.icon
              return (
                <div key={idx} className={`p-3 rounded-lg border ${alert.color}`}>
                  <div className="flex items-start gap-3">
                    <Icon className={`${alert.textColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className={`${alert.textColor} font-semibold text-sm`}>{alert.title}</p>
                      <p className={`${alert.textColor} text-xs opacity-80`}>{alert.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
