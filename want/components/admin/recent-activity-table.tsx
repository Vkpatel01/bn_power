import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockInvoices } from "@/lib/admin-data"

export function RecentActivityTable() {
  const recentInvoices = [...mockInvoices].reverse().slice(0, 8)

  return (
    <Card className="rounded-2xl shadow-sm border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Work Order No.</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Client Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Invoice No.</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-50`}
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">{invoice.woNo}</td>
                  <td className="py-3 px-4 text-gray-700">{invoice.client}</td>
                  <td className="py-3 px-4 text-gray-700">{invoice.invoiceNo}</td>
                  <td className="py-3 px-4 text-right text-gray-900 font-medium">₹{(invoice.total / 100000).toFixed(1)}L</td>
                  <td className="py-3 px-4 text-center">
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Partial"
                            ? "secondary"
                            : "destructive"
                      }
                      className="rounded-full"
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
