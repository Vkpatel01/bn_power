"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockWorkOrders } from "@/lib/admin-data"

export function InvoiceGenerator() {
  const [formData, setFormData] = useState({
    clientName: "",
    workOrderNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    amount: "",
    gst: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(formData.amount)
    const gst = Number.parseFloat(formData.gst)
    const total = amount + gst

    const invoiceData = {
      invoiceNo: `INV-${Date.now()}`,
      clientName: formData.clientName,
      workOrderNo: formData.workOrderNo,
      invoiceDate: formData.invoiceDate,
      amount: amount,
      gst: gst,
      total: total,
      description: formData.description,
      status: "Draft",
    }

    console.log("[v0] Generated Invoice:", invoiceData)
    alert(`Invoice generated: ${invoiceData.invoiceNo}\nTotal: ₹${invoiceData.total.toLocaleString()}`)

    // Reset form
    setFormData({
      clientName: "",
      workOrderNo: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      amount: "",
      gst: "",
      description: "",
    })
  }

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>Fill in the details to generate a new invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="clientName" className="text-sm font-medium">
                  Client Name
                </label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Enter client name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="workOrderNo" className="text-sm font-medium">
                  Work Order No
                </label>
                <select
                  id="workOrderNo"
                  name="workOrderNo"
                  value={formData.workOrderNo}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  required
                >
                  <option value="">Select Work Order</option>
                  {mockWorkOrders.map((wo) => (
                    <option key={wo.woNo} value={wo.woNo}>
                      {wo.woNo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="invoiceDate" className="text-sm font-medium">
                  Invoice Date
                </label>
                <Input
                  id="invoiceDate"
                  name="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount (₹)
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gst" className="text-sm font-medium">
                  GST (₹)
                </label>
                <Input
                  id="gst"
                  name="gst"
                  type="number"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Total (₹)</label>
                <Input
                  type="text"
                  value={
                    formData.amount && formData.gst
                      ? (Number.parseFloat(formData.amount) + Number.parseFloat(formData.gst)).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter invoice description or work details"
                rows={4}
                className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Generate Invoice
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
