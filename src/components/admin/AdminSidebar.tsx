"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ArrowLeft,
  Shield,
  FileText,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="pb-12 min-h-screen border-r bg-slate-900 text-white w-64 hidden md:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-6">
            <Shield className="h-6 w-6 text-red-400" />
            <h2 className="text-lg font-bold">Admin Panel</h2>
          </div>
          <div className="space-y-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                    pathname === link.href && "bg-slate-800 text-white"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2 border-t border-slate-700 pt-4">
          <div className="space-y-1">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to App
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
