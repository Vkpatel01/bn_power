"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/actions/analytics.actions"
import { useEffect, useState } from "react"

interface DashboardStats {
  totalWorkOrders: number;
  completedWorkOrders: number;
  pendingWorkOrders: number;
  totalInvoices: number;
  completedInvoices: number;
  pendingInvoices: number;
  totalRevenue: number;
  pendingAmount: number;
  collectedAmount: number;
}

export function SummaryCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const result = await getDashboardStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for custom refresh events
  useEffect(() => {
    const handleRefresh = () => fetchStats();
    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card shadow-md">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Work Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.totalWorkOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.completedWorkOrders} completed</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Total invoiced</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Collected Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">₹{stats.collectedAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Payments received</p>
        </CardContent>
      </Card>

      <Card className="bg-card shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">₹{stats.pendingAmount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Outstanding dues</p>
        </CardContent>
      </Card>
    </div>
  )
}