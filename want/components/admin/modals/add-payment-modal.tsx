"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddPaymentModal({ open, onOpenChange, onSubmit }: AddPaymentModalProps) {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    paidAmount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    modeOfPayment: "Bank Transfer",
    referenceNo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.invoiceNo.trim()) newErrors.invoiceNo = "Invoice Number is required"
    if (!formData.paidAmount || isNaN(Number(formData.paidAmount))) newErrors.paidAmount = "Valid amount is required"
    if (!formData.referenceNo.trim()) newErrors.referenceNo = "Reference Number is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      setFormData({
        invoiceNo: "",
        paidAmount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        modeOfPayment: "Bank Transfer",
        referenceNo: "",
      })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
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
            <Label htmlFor="paidAmount">Amount Paid (₹) *</Label>
            <Input
              id="paidAmount"
              type="number"
              placeholder="0"
              value={formData.paidAmount}
              onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
              className={errors.paidAmount ? "border-red-500" : ""}
            />
            {errors.paidAmount && <p className="text-xs text-red-500">{errors.paidAmount}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentDate">Payment Date</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modeOfPayment">Payment Mode</Label>
            <select
              id="modeOfPayment"
              value={formData.modeOfPayment}
              onChange={(e) => setFormData({ ...formData, modeOfPayment: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Bank Transfer</option>
              <option>Cheque</option>
              <option>Cash</option>
              <option>NEFT</option>
              <option>RTGS</option>
              <option>UPI</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referenceNo">Reference Number *</Label>
            <Input
              id="referenceNo"
              placeholder="e.g., UTR/Cheque No."
              value={formData.referenceNo}
              onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
              className={errors.referenceNo ? "border-red-500" : ""}
            />
            {errors.referenceNo && <p className="text-xs text-red-500">{errors.referenceNo}</p>}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Record Payment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
