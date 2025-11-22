"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AdminNav } from "./admin-nav"
import { useSession, signOut } from "next-auth/react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/bnpe-logo.jpg"
              alt="BN Power Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold">BN Power Admin</h1>
              <p className="text-xs opacity-90">Management System</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 text-primary border-primary/30 hover:bg-primary/10"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </header>

      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}