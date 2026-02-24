"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Settings, CreditCard, LogOut, BookOpen } from "lucide-react"

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Companies", href: "/dashboard/companies", icon: FileText },
        { name: "Directory", href: "/directory", icon: BookOpen },
        { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ]

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" })
    }

    return (
        <div className="pb-12 min-h-screen border-r bg-white w-64 hidden md:block">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="px-4 mb-4">
                        <span className="font-heading text-lg font-bold">
                            <span className="text-primary">Ez</span>
                            <span className="text-foreground">Darta</span>
                        </span>
                    </div>
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Dashboard
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant="ghost"
                                    className={cn(
                                        "w-full justify-start text-muted-foreground hover:text-primary hover:bg-[#E8F5FD]",
                                        pathname === link.href && "bg-[#E8F5FD] text-primary font-medium"
                                    )}
                                >
                                    <link.icon className="mr-2 h-4 w-4" />
                                    {link.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2 border-t border-border">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase mt-2">
                        Account
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-[#DC143C] hover:text-[#DC143C] hover:bg-[#FFF0F3]"
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
