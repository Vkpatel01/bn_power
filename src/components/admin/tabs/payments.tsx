"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getInvoices } from "@/actions/invoice.actions"
import { createPaymentReceipt } from "@/actions/invoice.actions"

interface Invoice {
  id: string;
  invoiceNo: string;
  client: string;
  totalBillingAmount: number;
  netPay: number;
  remainingAmount: number;
  isCompleted: boolean;
  paymentReceipt: any;
}

export function Payments() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({
    paymentReceived: "",
    paymentMethod: "ONLINE" as "ONLINE" | "CASH" | "OTHER",
    paymentStatus: "SUCCESS" as "SUCCESS" | "FAILED",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const result = await getInvoices();
    if (result.success) {
      // Filter invoices that have remaining amount
      setInvoices(result.data.filter((inv: Invoice) => inv.remainingAmount > 0));
    }
    setLoading(false);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const result = await createPaymentReceipt({
      paymentReceived: parseFloat(paymentData.paymentReceived),
      paymentMethod: paymentData.paymentMethod,
      paymentStatus: paymentData.paymentStatus,
      invoiceId: selectedInvoice.id,
    });

    if (result.success) {
      alert("Payment recorded successfully!");
      setPaymentData({
        paymentReceived: "",
        paymentMethod: "ONLINE",
        paymentStatus: "SUCCESS",
      });
      setSelectedInvoice(null);
      fetchInvoices();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payment Management</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outstanding Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Invoices</CardTitle>
            <CardDescription>{invoices.length} invoices with pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    selectedInvoice?.id === invoice.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-sm font-semibold">{invoice.invoiceNo}</p>
                      <p className="text-sm text-muted-foreground">{invoice.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{invoice.remainingAmount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {invoices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No outstanding invoices
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Record Payment</CardTitle>
            <CardDescription>
              {selectedInvoice ? `Recording payment for ${selectedInvoice.invoiceNo}` : "Select an invoice to record payment"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedInvoice ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Invoice Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Invoice:</span> {selectedInvoice.invoiceNo}</p>
                    <p><span className="font-medium">Client:</span> {selectedInvoice.client}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedInvoice.totalBillingAmount.toLocaleString()}</p>
                    <p><span className="font-medium">Net Pay:</span> ₹{selectedInvoice.netPay.toLocaleString()}</p>
                    <p><span className="font-medium">Remaining:</span> ₹{selectedInvoice.remainingAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Amount (₹)</label>
                  <Input
                    name="paymentReceived"
                    type="number"
                    value={paymentData.paymentReceived}
                    onChange={handleChange}
                    placeholder="0.00"
                    max={selectedInvoice.remainingAmount}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={paymentData.paymentMethod}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
                  >
                    <option value="ONLINE">Online</option>
                    <option value="CASH">Cash</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={paymentData.paymentStatus}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base"
                  >
                    <option value="SUCCESS">Success</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Record Payment
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSelectedInvoice(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Select an invoice from the left to record a payment
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}