"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Client-side auth check - verify user is authenticated
    const isAuthenticated = sessionStorage.getItem("isAdminAuthenticated")
    if (!isAuthenticated) {
      router.push("/admin/login")
    }
  }, [router])

  return <>{children}</>
}
