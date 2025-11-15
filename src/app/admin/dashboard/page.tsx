"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/admin/dashboard-header";
import { SummaryCards } from "@/components/admin/summary-cards";
import { DashboardTabs } from "@/components/admin/dashboard-tabs";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    sessionStorage.removeItem("adminEmail");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 bg-transparent"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        <SummaryCards />
        <DashboardTabs />
      </main>
    </div>
  );
}
