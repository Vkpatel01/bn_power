"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { createInvoice } from "@/actions/invoice.actions"
import { getWorkOrders } from "@/actions/workorder.action"

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  clientName: string;
  totalAmount: number;
  remainingAmount: number;
}

export function InvoiceGenerator() {
  const { toast } = useToast();
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedWO, setSelectedWO] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    woNumber: "",
    site: "",
    invoiceDate: "",
    invoiceNo: "",
    client: "",
    billingAmount: "",
    billingIGST: "",
    billingSGST: "",
    tds: "",
  });

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    const result = await getWorkOrders();
    if (result.success) {
      setWorkOrders(result.data);
    }
  };

  const handleWOSelect = (woId: string) => {
    const wo = workOrders.find(w => w.id === woId);
    if (wo) {
      setSelectedWO(wo);
      setFormData(prev => ({
        ...prev,
        woNumber: wo.workOrderNumber,
        client: wo.clientName,
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotals = () => {
    const billingAmount = parseFloat(formData.billingAmount) || 0;
    const igst = parseFloat(formData.billingIGST) || 0;
    const sgst = parseFloat(formData.billingSGST) || 0;
    const tds = parseFloat(formData.tds) || 0;
    
    const totalBillingAmount = billingAmount + igst + sgst;
    const netPay = totalBillingAmount - tds;
    
    return { totalBillingAmount, netPay };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWO) return;

    const billingAmount = parseFloat(formData.billingAmount);
    if (billingAmount > selectedWO.remainingAmount) {
      toast({
        title: "Invalid Amount",
        description: `Billing amount cannot exceed remaining work order amount of ₹${selectedWO.remainingAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { totalBillingAmount, netPay } = calculateTotals();

    try {
      const result = await createInvoice({
        woDate: new Date(),
        woNumber: formData.woNumber,
        site: formData.site,
        invoiceDate: new Date(formData.invoiceDate),
        invoiceNo: formData.invoiceNo,
        client: formData.client,
        billingAmount,
        billingIGST: parseFloat(formData.billingIGST),
        billingSGST: parseFloat(formData.billingSGST),
        totalBillingAmount,
        tds: parseFloat(formData.tds),
        netPay,
        workOrderId: selectedWO.id,
      });

      if (result.success) {
        toast({
          title: "Success",
          description: "Invoice created successfully!",
        });
        setFormData({
          woNumber: "",
          site: "",
          invoiceDate: "",
          invoiceNo: "",
          client: "",
          billingAmount: "",
          billingIGST: "",
          billingSGST: "",
          tds: "",
        });
        setSelectedWO(null);
        
        // Trigger dashboard refresh
        window.dispatchEvent(new CustomEvent('refreshDashboard'));
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create invoice",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const { totalBillingAmount, netPay } = calculateTotals();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Invoice Generator</h3>

      <Card>
        <CardHeader>
          <CardTitle>Generate New Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Work Order</label>
              <select
                value={selectedWO?.id || ""}
                onChange={(e) => handleWOSelect(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
                required
              >
                <option value="">Select a work order</option>
                {workOrders.map((wo) => (
                  <option key={wo.id} value={wo.id}>
                    {wo.workOrderNumber} - {wo.clientName}
                  </option>
                ))}
              </select>
            </div>

            {selectedWO && (
              <>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold mb-2">Work Order Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium">WO Number</p>
                      <p className="font-mono">{selectedWO.workOrderNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Client</p>
                      <p>{selectedWO.clientName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p className="font-bold">₹{selectedWO.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Remaining Amount</p>
                      <p className="font-bold text-green-600">₹{selectedWO.remainingAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">WO Number</label>
                    <Input name="woNumber" value={formData.woNumber} onChange={handleChange} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Client</label>
                    <Input name="client" value={formData.client} onChange={handleChange} readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Site</label>
                    <Input name="site" value={formData.site} onChange={handleChange} placeholder="Site location" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice Date</label>
                    <Input name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invoice Number</label>
                    <Input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="INV-2024-001" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Billing Amount (₹)</label>
                    <Input 
                      name="billingAmount" 
                      type="number" 
                      value={formData.billingAmount} 
                      onChange={handleChange} 
                      placeholder="0.00" 
                      max={selectedWO.remainingAmount}
                      required 
                    />
                    <p className="text-xs text-muted-foreground">
                      Max: ₹{selectedWO.remainingAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">IGST (₹)</label>
                    <Input name="billingIGST" type="number" value={formData.billingIGST} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SGST (₹)</label>
                    <Input name="billingSGST" type="number" value={formData.billingSGST} onChange={handleChange} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">TDS (₹)</label>
                    <Input name="tds" type="number" value={formData.tds} onChange={handleChange} placeholder="0.00" />
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Calculated Totals</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Total Billing Amount</p>
                      <p className="text-lg font-bold">₹{totalBillingAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="font-medium">Net Pay (After TDS)</p>
                      <p className="text-lg font-bold text-green-600">₹{netPay.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Generating..." : "Generate Invoice"}
                </Button>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}