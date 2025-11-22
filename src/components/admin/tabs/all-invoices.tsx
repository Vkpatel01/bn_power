"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getInvoices, deleteInvoice } from "@/actions/invoice.actions"
import { getWorkOrders } from "@/actions/workorder.action"

interface Invoice {
  id: string;
  invoiceNo: string;
  invoiceDate: Date;
  billingAmount: number;
  taxType?: string;
  igstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  totalBillingAmount: number;
  tdsAmount: number;
  netPayAmount: number;
  remainingAmount: number;
  remarks?: string;
  workOrder: {
    workOrderNumber: string;
    clientName: string;
    location?: string;
  };
  payments: any[];
}

export function AllInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    const result = await getInvoices();
    if (result.success) {
      setInvoices(result.data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const result = await deleteInvoice(id);
      if (result.success) {
        fetchInvoices();
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.workOrder.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.workOrder.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (invoice: Invoice) => {
    if (invoice.remainingAmount === 0) return "bg-green-100 text-green-800";
    if (invoice.payments && invoice.payments.length > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getStatusText = (invoice: Invoice) => {
    if (invoice.remainingAmount === 0) return "Paid";
    if (invoice.payments && invoice.payments.length > 0) return "Partial";
    return "Unpaid";
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Invoices</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>{filteredInvoices.length} invoices found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Invoice No</th>
                  <th className="px-4 py-3 text-left font-medium">Client</th>
                  <th className="px-4 py-3 text-left font-medium">WO Number</th>
                  <th className="px-4 py-3 text-left font-medium">Location</th>
                  <th className="px-4 py-3 text-left font-medium">Invoice Date</th>
                  <th className="px-4 py-3 text-left font-medium">Total Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Net Pay</th>
                  <th className="px-4 py-3 text-left font-medium">Remaining</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-muted/50 transition">
                    <td className="px-4 py-3 font-mono text-xs font-semibold">{invoice.invoiceNo}</td>
                    <td className="px-4 py-3">{invoice.workOrder.clientName}</td>
                    <td className="px-4 py-3 font-mono text-xs">{invoice.workOrder.workOrderNumber}</td>
                    <td className="px-4 py-3">{invoice.workOrder.location || 'N/A'}</td>
                    <td className="px-4 py-3 text-xs">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">₹{invoice.totalBillingAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">₹{invoice.netPayAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-orange-600">₹{invoice.remainingAmount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice)}`}>
                        {getStatusText(invoice)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(invoice.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No invoices found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}