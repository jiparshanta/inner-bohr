import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Actually I'll create a simple Badge component usage inline or import from UI if I had it. 
// I'll just use tailwind classes for badge.

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, Prashant</h2>
                <p className="text-muted-foreground">Here's an overview of your company registrations.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">Recent Applications</h3>
                <Card>
                    <CardHeader>
                        <div className="grid grid-cols-4 font-medium text-sm text-muted-foreground">
                            <div>Company Name</div>
                            <div>Status</div>
                            <div>Date</div>
                            <div>Action</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 items-center text-sm">
                            <div className="font-medium">Everest Tech Solutions Pvt. Ltd.</div>
                            <div>
                                <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-50 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                                    Pending Review
                                </span>
                            </div>
                            <div className="text-muted-foreground">Jan 18, 2026</div>
                            <div>
                                <span className="text-blue-600 hover:underline cursor-pointer">View Details</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
