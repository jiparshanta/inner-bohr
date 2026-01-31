import { getDashboardStats } from "@/app/actions/companies"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Building2, Clock, CheckCircle, CreditCard, ArrowRight } from "lucide-react"

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  under_review: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
  },
  approved: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  },
}

export default async function DashboardPage() {
  const session = await auth()
  const result = await getDashboardStats()

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const { stats, recentCompanies } = result
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "User"

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h2>
          <p className="text-muted-foreground">Here&apos;s an overview of your company registrations.</p>
        </div>
        <Link href="/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register New Company
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Companies registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approved || 0}</div>
            <p className="text-xs text-muted-foreground">Successfully registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR {(stats?.totalPayments || 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Amount paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest company registration applications</CardDescription>
          </div>
          {recentCompanies && recentCompanies.length > 0 && (
            <Link href="/dashboard/companies">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent>
          {!recentCompanies || recentCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by registering your first company
              </p>
              <Link href="/register">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Register Company
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-4 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div>Company Name</div>
                <div>Status</div>
                <div>Date</div>
                <div>Action</div>
              </div>

              {/* Table Rows */}
              {recentCompanies.map((company) => {
                const status = statusConfig[company.status as keyof typeof statusConfig] || statusConfig.pending

                return (
                  <div
                    key={company.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-4 rounded-lg border items-center"
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      {company.nameNepali && (
                        <p className="text-sm text-muted-foreground">{company.nameNepali}</p>
                      )}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(company.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      <Link href={`/dashboard/companies/${company.id}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Register New Company</CardTitle>
            <CardDescription>Start a new company registration application</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/register">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Start Registration
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">View Companies</CardTitle>
            <CardDescription>Manage your registered companies</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/companies">
              <Button variant="outline" className="w-full">
                <Building2 className="mr-2 h-4 w-4" />
                My Companies
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
            <CardDescription>View all your transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/payments">
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                View Payments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
