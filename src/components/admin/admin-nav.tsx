"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { BarChart3, FileText, CreditCard, DollarSign } from 'lucide-react'
import { cn } from "@/lib/utils"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/work-orders", label: "Work Orders", icon: FileText },
    { href: "/admin/invoices", label: "Invoices", icon: CreditCard },
    { href: "/admin/payments", label: "Payments", icon: DollarSign },
  ]

  return (
    <nav className="sticky top-16 z-40 bg-primary text-primary-foreground border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 h-16">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-primary-foreground"
                )}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}