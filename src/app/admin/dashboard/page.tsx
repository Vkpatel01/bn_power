"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/admin/dashboard-layout";
import { SummaryCards } from "@/components/admin/summary-cards";
import { DashboardTabs } from "@/components/admin/dashboard-tabs";

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('refreshDashboard', handleRefresh);
    return () => window.removeEventListener('refreshDashboard', handleRefresh);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
        <SummaryCards key={refreshKey} />
        <DashboardTabs />
      </div>
    </DashboardLayout>
  );
}
