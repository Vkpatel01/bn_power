"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInvoices } from "@/lib/admin-data"

export function AllInvoices() {
  const [selectedClient, setSelectedClient] = useState("all")
  const [selectedFY, setSelectedFY] = useState("all")

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const clientMatch = selectedClient === "all" || invoice.client === selectedClient
    const fyMatch = selectedFY === "all" || invoice.fy === selectedFY
    return clientMatch && fyMatch
  })

  const clients = ["all", ...new Set(mockInvoices.map((inv) => inv.client))]
  const fys = ["all", ...new Set(mockInvoices.map((inv) => inv.fy))]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Client</label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
              >
                {clients.map((client) => (
                  <option key={client} value={client}>
                    {client === "all" ? "All Clients" : client}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Financial Year</label>
              <select
                value={selectedFY}
                onChange={(e) => setSelectedFY(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
              >
                {fys.map((fy) => (
                  <option key={fy} value={fy}>
                    {fy === "all" ? "All FY" : fy}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
          <CardDescription>
            Showing {filteredInvoices.length} of {mockInvoices.length} invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Invoice No</th>
                  <th className="px-4 py-2 text-left font-medium">Client</th>
                  <th className="px-4 py-2 text-left font-medium">Amount</th>
                  <th className="px-4 py-2 text-left font-medium">FY</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.invoiceNo} className="border-b hover:bg-muted/50 transition">
                      <td className="px-4 py-3 font-mono text-xs">{invoice.invoiceNo}</td>
                      <td className="px-4 py-3">{invoice.client}</td>
                      <td className="px-4 py-3 font-medium">₹{invoice.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">{invoice.fy}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">{invoice.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
