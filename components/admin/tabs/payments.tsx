import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockPayments } from "@/lib/admin-data"

export function Payments() {
  const totalBalance = mockPayments.reduce((sum, payment) => sum + payment.balance, 0)

  return (
    <div className="space-y-4">
      <Card className="bg-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Outstanding Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-accent">₹{totalBalance.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>{mockPayments.length} payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Invoice No</th>
                  <th className="px-4 py-2 text-left font-medium">Amount Received</th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                  <th className="px-4 py-2 text-left font-medium">Balance</th>
                </tr>
              </thead>
              <tbody>
                {mockPayments.map((payment) => (
                  <tr key={payment.invoiceNo} className="border-b hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-mono text-xs">{payment.invoiceNo}</td>
                    <td className="px-4 py-3 font-medium text-green-600">₹{payment.amountReceived.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs">{payment.date}</td>
                    <td className="px-4 py-3 font-medium text-orange-600">₹{payment.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
