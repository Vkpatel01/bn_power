"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown } from "lucide-react"
import { createWorkOrder, getWorkOrders, deleteWorkOrder } from "@/actions/workorder.action"
import { getInvoices } from "@/actions/invoice.actions"

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  clientName: string;
  GSTIN?: string;
  workOrderDate: Date;
  workDescription: string;
  amount: number;
  GST: number;
  totalAmount: number;
  remainingAmount: number;
  isCompleted: boolean;
  invoices: any[];
}

export function WorkOrders() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingWO, setIsAddingWO] = useState(false);
  const [expandedWO, setExpandedWO] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    workOrderNumber: "",
    clientName: "",
    GSTIN: "",
    workOrderDate: "",
    workDescription: "",
    amount: "",
    GST: "",
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    const result = await getWorkOrders();
    if (result.success) {
      setWorkOrders(result.data);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const gst = parseFloat(formData.GST);
    const totalAmount = amount + (amount * gst / 100);

    const result = await createWorkOrder({
      workOrderNumber: formData.workOrderNumber,
      clientName: formData.clientName,
      GSTIN: formData.GSTIN || undefined,
      workOrderDate: new Date(formData.workOrderDate),
      workDescription: formData.workDescription,
      amount,
      GST: gst,
      totalAmount,
    });

    if (result.success) {
      setFormData({
        workOrderNumber: "",
        clientName: "",
        GSTIN: "",
        workOrderDate: "",
        workDescription: "",
        amount: "",
        GST: "",
      });
      setIsAddingWO(false);
      fetchWorkOrders();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this work order?")) {
      const result = await deleteWorkOrder(id);
      if (result.success) {
        fetchWorkOrders();
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
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
                  <label className="text-sm font-medium">Work Order Number</label>
                  <Input name="workOrderNumber" value={formData.workOrderNumber} onChange={handleChange} placeholder="WO-001" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Client Name</label>
                  <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Client name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GSTIN (Optional)</label>
                  <Input name="GSTIN" value={formData.GSTIN} onChange={handleChange} placeholder="GSTIN" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Order Date</label>
                  <Input name="workOrderDate" type="date" value={formData.workOrderDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount (₹)</label>
                  <Input name="amount" type="number" value={formData.amount} onChange={handleChange} placeholder="0.00" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GST (%)</label>
                  <Input name="GST" type="number" value={formData.GST} onChange={handleChange} placeholder="18" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Work Description</label>
                <textarea
                  name="workDescription"
                  value={formData.workDescription}
                  onChange={handleChange}
                  placeholder="Describe the work to be done"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
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
          <CardDescription>{workOrders.length} work orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {workOrders.map((wo) => (
              <div key={wo.id} className="border rounded-lg overflow-hidden">
                <div
                  className="flex items-center gap-4 px-4 py-3 bg-muted/30 hover:bg-muted/50 transition cursor-pointer"
                  onClick={() => setExpandedWO(expandedWO === wo.id ? null : wo.id)}
                >
                  <ChevronDown
                    size={18}
                    className={`transition-transform flex-shrink-0 ${expandedWO === wo.id ? "rotate-180" : ""}`}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2 flex-1 text-sm">
                    <div>
                      <p className="font-mono font-semibold text-xs">{wo.workOrderNumber}</p>
                    </div>
                    <div>
                      <p className="text-foreground">{wo.clientName}</p>
                    </div>
                    <div>
                      <p className="font-medium">₹{wo.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{new Date(wo.workOrderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${wo.isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                        {wo.isCompleted ? "Completed" : "Active"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setExpandedWO(expandedWO === wo.id ? null : wo.id); }}>
                        View
                      </Button>
                      <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleDelete(wo.id); }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>

                {expandedWO === wo.id && (
                  <div className="bg-white dark:bg-slate-950 border-t p-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Work Description</h4>
                        <p className="text-sm text-muted-foreground">{wo.workDescription}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium">Amount</p>
                          <p>₹{wo.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">GST</p>
                          <p>{wo.GST}%</p>
                        </div>
                        <div>
                          <p className="font-medium">Total Amount</p>
                          <p>₹{wo.totalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Remaining</p>
                          <p>₹{wo.remainingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Invoices ({wo.invoices.length})</h4>
                        {wo.invoices.length > 0 ? (
                          <div className="text-sm text-muted-foreground">
                            {wo.invoices.length} invoice(s) generated
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No invoices generated yet</p>
                        )}
                      </div>
                    </div>
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