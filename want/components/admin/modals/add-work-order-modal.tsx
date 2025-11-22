"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddWorkOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
}

export function AddWorkOrderModal({ open, onOpenChange, onSubmit }: AddWorkOrderModalProps) {
  const [formData, setFormData] = useState({
    woNo: "",
    client: "",
    site: "",
    value: "",
    status: "Active",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.woNo.trim()) newErrors.woNo = "WO Number is required"
    if (!formData.client.trim()) newErrors.client = "Client name is required"
    if (!formData.value || isNaN(Number(formData.value))) newErrors.value = "Valid amount is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
      setFormData({ woNo: "", client: "", site: "", value: "", status: "Active" })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Work Order</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            <Label htmlFor="site">Site Location</Label>
            <Input
              id="site"
              placeholder="e.g., Sasan, MP"
              value={formData.site}
              onChange={(e) => setFormData({ ...formData, site: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Contract Value (₹) *</Label>
            <Input
              id="value"
              type="number"
              placeholder="0"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className={errors.value ? "border-red-500" : ""}
            />
            {errors.value && <p className="text-xs text-red-500">{errors.value}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Work Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
