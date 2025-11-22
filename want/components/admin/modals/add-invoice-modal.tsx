"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddInvoiceModal({ open, onOpenChange, onSubmit }: AddInvoiceModalProps) {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    woNo: "",
    client: "",
    invoiceAmount: "",
    gstRate: "18",
    paymentStatus: "Pending",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.invoiceNo.trim()) newErrors.invoiceNo = "Invoice Number is required"
    if (!formData.woNo.trim()) newErrors.woNo = "WO Number is required"
    if (!formData.client.trim()) newErrors.client = "Client name is required"
    if (!formData.invoiceAmount || isNaN(Number(formData.invoiceAmount))) newErrors.invoiceAmount = "Valid amount is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const gst = (Number(formData.invoiceAmount) * Number(formData.gstRate)) / 100
      const netPayable = Number(formData.invoiceAmount) + gst
      onSubmit({ ...formData, gst, netPayable: netPayable, total: netPayable })
      setFormData({ invoiceNo: "", woNo: "", client: "", invoiceAmount: "", gstRate: "18", paymentStatus: "Pending" })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNo">Invoice Number *</Label>
            <Input
              id="invoiceNo"
              placeholder="e.g., INV-2024-001"
              value={formData.invoiceNo}
              onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
              className={errors.invoiceNo ? "border-red-500" : ""}
            />
            {errors.invoiceNo && <p className="text-xs text-red-500">{errors.invoiceNo}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="woNo">WO Number *</Label>
            <Input
              id="woNo"
              placeholder="e.g., WO-2024-001"
              value={formData.woNo}
              onChange={(e) => setFormData({ ...formData, woNo: e.target.value })}
              className={errors.woNo ? "border-red-500" : ""}
            />
            {errors.woNo && <p className="text-xs text-red-500">{errors.woNo}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="client">Client Name *</Label>
            <Input
              id="client"
              placeholder="e.g., Reliance Power"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              className={errors.client ? "border-red-500" : ""}
            />
            {errors.client && <p className="text-xs text-red-500">{errors.client}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoiceAmount">Invoice Amount (₹) *</Label>
            <Input
              id="invoiceAmount"
              type="number"
              placeholder="0"
              value={formData.invoiceAmount}
              onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
              className={errors.invoiceAmount ? "border-red-500" : ""}
            />
            {errors.invoiceAmount && <p className="text-xs text-red-500">{errors.invoiceAmount}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="gstRate">GST Rate (%)</Label>
            <select
              id="gstRate"
              value={formData.gstRate}
              onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>5</option>
              <option>12</option>
              <option>18</option>
              <option>28</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentStatus">Payment Status</Label>
            <select
              id="paymentStatus"
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Pending</option>
              <option>Partial</option>
              <option>Paid</option>
              <option>Unpaid</option>
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
