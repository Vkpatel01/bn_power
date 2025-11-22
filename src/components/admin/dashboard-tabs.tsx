"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWorkOrders } from "@/actions/workorder.action"
import { getInvoices } from "@/actions/invoice.actions"
import { getPayments } from "@/actions/payment.actions"
import Link from "next/link"

export function DashboardTabs() {
  const [recentData, setRecentData] = useState({
    workOrders: [],
    invoices: [],
    payments: []
  })

  useEffect(() => {
    const fetchRecentData = async () => {
      const [workOrdersRes, invoicesRes, paymentsRes] = await Promise.all([
        getWorkOrders(),
        getInvoices(),
        getPayments()
      ])

      setRecentData({
        workOrders: workOrdersRes.success ? workOrdersRes.data.slice(0, 5) : [],
        invoices: invoicesRes.success ? invoicesRes.data.slice(0, 5) : [],
        payments: paymentsRes.success ? paymentsRes.data.slice(0, 5) : []
      })
    }

    fetchRecentData()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Work Orders</CardTitle>
          <Link href="/admin/work-orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentData.workOrders.map((wo: any) => (
              <div key={wo.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-mono text-xs">{wo.workOrderNumber}</p>
                  <p className="text-sm text-muted-foreground">{wo.clientName}</p>
                </div>
                <p className="text-sm font-medium">₹{wo.totalAmount.toLocaleString()}</p>
              </div>
            ))}
            {recentData.workOrders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No work orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Invoices</CardTitle>
          <Link href="/admin/invoices">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentData.invoices.map((invoice: any) => (
              <div key={invoice.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-mono text-xs">{invoice.invoiceNo}</p>
                  <p className="text-sm text-muted-foreground">{invoice.workOrder?.clientName}</p>
                </div>
                <p className="text-sm font-medium">₹{invoice.totalBillingAmount.toLocaleString()}</p>
              </div>
            ))}
            {recentData.invoices.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No invoices yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Payments</CardTitle>
          <Link href="/admin/payments">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentData.payments.map((payment: any) => (
              <div key={payment.id} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <p className="font-mono text-xs">{payment.invoice?.invoiceNo}</p>
                  <p className="text-sm text-muted-foreground">{payment.paymentMode}</p>
                </div>
                <p className="text-sm font-medium">₹{payment.paymentAmount.toLocaleString()}</p>
              </div>
            ))}
            {recentData.payments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No payments yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
