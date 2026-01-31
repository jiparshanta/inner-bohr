"use client"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, LogOut, User, Shield } from "lucide-react"

export function Navbar() {
    const { data: session, status } = useSession()
    const isLoading = status === "loading"
    const isAdmin = session?.user?.role === "admin"

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/" })
    }

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
                        <Link href="/directory" className="transition-colors hover:text-foreground/80 text-foreground/60">Directory</Link>
                        <Link href="/services" className="transition-colors hover:text-foreground/80 text-foreground/60">Services</Link>
                        <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
                        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
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
                    <Button variant="ghost" className="md:hidden" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
