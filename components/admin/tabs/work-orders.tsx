"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mockWorkOrders, mockInvoices } from "@/lib/admin-data"
import { ChevronDown } from "lucide-react"

export function WorkOrders() {
  const [isAddingWO, setIsAddingWO] = useState(false)
  const [expandedWO, setExpandedWO] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    woNo: "",
    client: "",
    value: "",
    startDate: "",
    endDate: "",
    status: "Active",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] New Work Order:", formData)
    alert(`Work Order ${formData.woNo} added successfully!`)
    setFormData({
      woNo: "",
      client: "",
      value: "",
      startDate: "",
      endDate: "",
      status: "Active",
    })
    setIsAddingWO(false)
  }

  const getInvoicesForWO = (woNo: string) => {
    return mockInvoices.filter((inv) => inv.woNo === woNo)
  }

  const getInvoiceCount = (woNo: string) => {
    return getInvoicesForWO(woNo).length
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Unpaid":
        return "bg-red-100 text-red-800"
      case "Partial":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Orders</h3>
        <Button onClick={() => setIsAddingWO(!isAddingWO)} className="gap-2">
          {isAddingWO ? "Cancel" : "+ Add Work Order"}
        </Button>
      </div>

      {isAddingWO && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Work Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">WO No</label>
                  <Input name="woNo" value={formData.woNo} onChange={handleChange} placeholder="WO-001" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client</label>
                  <Input
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="Client name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Value (₹)</label>
                  <Input
                    name="value"
                    type="number"
                    value={formData.value}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
                  >
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Pending</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Work Order
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Work Orders</CardTitle>
          <CardDescription>{mockWorkOrders.length} work orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {mockWorkOrders.map((wo) => (
              <div key={wo.woNo} className="border rounded-lg mb-2 overflow-hidden">
                <div
                  className="flex items-center gap-4 px-4 py-3 bg-muted/30 hover:bg-muted/50 transition cursor-pointer"
                  onClick={() => setExpandedWO(expandedWO === wo.woNo ? null : wo.woNo)}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform flex-shrink-0 ${expandedWO === wo.woNo ? "rotate-180" : ""}`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-2 flex-1 text-sm">
                    <div>
                      <p className="font-mono font-semibold text-xs">{wo.woNo}</p>
                    </div>
                    <div>
                      <p className="text-foreground">{wo.client}</p>
                    </div>
                    <div>
                      <p className="font-medium">₹{wo.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{wo.startDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{wo.endDate}</p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          wo.status === "Active"
                            ? "bg-blue-100 text-blue-800"
                            : wo.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {wo.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-blue-600">{getInvoiceCount(wo.woNo)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedWO(expandedWO === wo.woNo ? null : wo.woNo)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedWO === wo.woNo && (
                  <div className="bg-white dark:bg-slate-950 border-t p-4 space-y-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-base">Invoices for {wo.woNo}</h4>
                      <Button size="sm" variant="ghost" onClick={() => setExpandedWO(null)}>
                        Close
                      </Button>
                    </div>

                    {getInvoicesForWO(wo.woNo).length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="px-4 py-2 text-left font-medium">Invoice No</th>
                              <th className="px-4 py-2 text-left font-medium">Invoice Date</th>
                              <th className="px-4 py-2 text-left font-medium">Amount</th>
                              <th className="px-4 py-2 text-left font-medium">Status</th>
                              <th className="px-4 py-2 text-left font-medium">Financial Year</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getInvoicesForWO(wo.woNo).map((invoice) => (
                              <tr key={invoice.invoiceNo} className="border-b hover:bg-muted/50 transition">
                                <td className="px-4 py-3 font-mono text-xs font-semibold">{invoice.invoiceNo}</td>
                                <td className="px-4 py-3 text-xs">{invoice.date}</td>
                                <td className="px-4 py-3 font-medium">₹{invoice.total.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}
                                  >
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-xs">{invoice.fy}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No invoices raised for this work order</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
