"use client"
import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User, Shield } from "lucide-react"

export function Navbar() {
    const { data: session, status } = useSession()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const isLoading = status === "loading"
    const isAdmin = session?.user?.role === "admin"

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" })
    }

    const navLinks = [
        { href: "/directory", label: "Directory" },
        { href: "/services", label: "Services" },
        { href: "/pricing", label: "Pricing" },
        { href: "/about", label: "About" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            NepalCompanyReg
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2">
                        {isLoading ? (
                            <div className="h-9 w-24 animate-pulse bg-muted rounded-md" />
                        ) : session?.user ? (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2 text-sm">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{session.user.name || session.user.email}</span>
                                    {isAdmin && (
                                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                            Admin
                                        </span>
                                    )}
                                </div>
                                {isAdmin && (
                                    <Link href="/admin">
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                            <Shield className="h-4 w-4 mr-1" />
                                            Admin
                                        </Button>
                                    </Link>
                                )}
                                <Link href="/dashboard">
                                    <Button variant="ghost" size="sm">Dashboard</Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSignOut}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/signup">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        className="md:hidden"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 bg-background">
                    <nav className="flex flex-col px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="border-t border-border/40 pt-4 mt-2">
                            {isLoading ? (
                                <div className="h-9 w-full animate-pulse bg-muted rounded-md" />
                            ) : session?.user ? (
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center space-x-2 text-sm py-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">{session.user.name || session.user.email}</span>
                                        {isAdmin && (
                                            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                                                <Shield className="h-4 w-4 mr-2" />
                                                Admin Panel
                                            </Button>
                                        </Link>
                                    )}
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" size="sm" className="w-full justify-start">
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            handleSignOut()
                                            setMobileMenuOpen(false)
                                        }}
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col space-y-2">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full">Login</Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
