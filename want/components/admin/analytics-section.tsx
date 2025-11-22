"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Mock data for billing vs payments over time
const billingData = [
  { month: "Jan", billing: 177000, payments: 177000 },
  { month: "Feb", billing: 236000, payments: 100000 },
  { month: "Mar", billing: 118000, payments: 118000 },
  { month: "Apr", billing: 206500, payments: 0 },
  { month: "May", billing: 265500, payments: 132750 },
]

// Mock data for work order status
const statusData = [
  { name: "Active", value: 2, color: "#0A66C2" },
  { name: "Completed", value: 1, color: "#10B981" },
  { name: "Pending", value: 1, color: "#F59E0B" },
]

export function AnalyticsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Billing vs Payments Chart */}
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Billing vs Payments Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={billingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="billing" fill="#0A66C2" radius={[8, 8, 0, 0]} />
              <Bar dataKey="payments" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Work Order Status Pie Chart */}
      <Card className="rounded-2xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Work Order Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={{ position: "insideRight" }} outerRadius={100} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
