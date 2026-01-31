import { getUserCompanies } from "@/app/actions/companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Building2, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
  },
  under_review: {
    label: "Under Review",
    icon: AlertCircle,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300",
  },
}

const companyTypes: Record<string, string> = {
  pvt_ltd: "Private Limited",
  public_ltd: "Public Limited",
  partnership: "Partnership",
  sole_proprietorship: "Sole Proprietorship",
}

export default async function CompaniesPage() {
  const result = await getUserCompanies()

  if (result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const companies = result.companies || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Companies</h2>
          <p className="text-muted-foreground">Manage your registered and pending companies</p>
        </div>
        <Link href="/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Register New Company
          </Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by registering your first company
            </p>
            <Link href="/register">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Register Company
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => {
            const status = statusConfig[company.status as keyof typeof statusConfig] || statusConfig.pending
            const StatusIcon = status.icon

            return (
              <Card key={company.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      {company.nameNepali && (
                        <p className="text-sm text-muted-foreground">{company.nameNepali}</p>
                      )}
                    </div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Type:</span>{" "}
                    <span className="font-medium">{companyTypes[company.type] || company.type}</span>
                  </div>
                  {company.registrationNumber && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reg. No:</span>{" "}
                      <span className="font-medium">{company.registrationNumber}</span>
                    </div>
                  )}
                  {company.address && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Address:</span>{" "}
                      <span className="font-medium">{company.address}</span>
                    </div>
                  )}
                  <div className="text-sm">
                    <span className="text-muted-foreground">Submitted:</span>{" "}
                    <span className="font-medium">
                      {new Date(company.submittedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <Link href={`/dashboard/companies/${company.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
