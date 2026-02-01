"use client"

import { useState } from "react"
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
  Menu,
  X,
} from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Companies", href: "/admin/companies", icon: Building2 },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await signOut({ callbackUrl: window.location.origin })
  }

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <div className="px-3 py-2">
        <div className="flex items-center gap-2 px-4 mb-6">
          <Shield className="h-6 w-6 text-red-400" />
          <h2 className="text-lg font-bold">Admin Panel</h2>
        </div>
        <div className="space-y-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={onLinkClick}>
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
          <Link href="/dashboard" onClick={onLinkClick}>
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
            onClick={() => {
              onLinkClick?.()
              handleLogout()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-400" />
          <span className="font-bold">Admin Panel</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-800"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "md:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out overflow-y-auto",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="py-4">
          <SidebarContent onLinkClick={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="pb-12 min-h-screen border-r bg-slate-900 text-white w-64 hidden md:block">
        <div className="space-y-4 py-4">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile spacer for fixed header */}
      <div className="md:hidden h-14" />
    </>
  )
}
