import { getAllCompanies } from "@/app/actions/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { CompanyActions } from "./CompanyActions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", className: "bg-blue-100 text-blue-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700" },
}

const companyTypes: Record<string, string> = {
  pvt_ltd: "Pvt. Ltd.",
  public_ltd: "Public Ltd.",
  partnership: "Partnership",
  sole_proprietorship: "Sole Prop.",
}

export default async function AdminCompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const status = params.status || ""
  const search = params.search || ""

  const result = await getAllCompanies(page, 10, status, search)

  if ("error" in result && result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const companies = "companies" in result ? result.companies : []
  const total = "total" in result ? result.total : 0
  const pages = "pages" in result ? result.pages : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Company Management</h2>
        <p className="text-muted-foreground">Review and manage company registrations ({total} total)</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/companies">
          <Button variant={!status ? "default" : "outline"} size="sm">All</Button>
        </Link>
        <Link href="/admin/companies?status=pending">
          <Button variant={status === "pending" ? "default" : "outline"} size="sm">Pending</Button>
        </Link>
        <Link href="/admin/companies?status=under_review">
          <Button variant={status === "under_review" ? "default" : "outline"} size="sm">Under Review</Button>
        </Link>
        <Link href="/admin/companies?status=approved">
          <Button variant={status === "approved" ? "default" : "outline"} size="sm">Approved</Button>
        </Link>
        <Link href="/admin/companies?status=rejected">
          <Button variant={status === "rejected" ? "default" : "outline"} size="sm">Rejected</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Applications
          </CardTitle>
          <CardDescription>Review and approve company registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {!companies || companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No companies found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-7 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div>Company Name</div>
                <div>Type</div>
                <div>Owner</div>
                <div>Status</div>
                <div>Submitted</div>
                <div>Reg. No.</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              {companies.map((company) => {
                const statusInfo = statusConfig[company.status as keyof typeof statusConfig] || statusConfig.pending
                return (
                  <div
                    key={company.id}
                    className="grid grid-cols-1 lg:grid-cols-7 gap-2 lg:gap-4 p-4 rounded-lg border items-center"
                  >
                    <div>
                      <p className="font-medium">{company.name}</p>
                      {company.nameNepali && (
                        <p className="text-xs text-muted-foreground">{company.nameNepali}</p>
                      )}
                    </div>
                    <div className="text-sm">
                      {companyTypes[company.type] || company.type}
                    </div>
                    <div className="text-sm">
                      <p>{company.user?.name || "No name"}</p>
                      <p className="text-xs text-muted-foreground">{company.user?.email}</p>
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(company.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm font-mono">
                      {company.registrationNumber || "-"}
                    </div>
                    <div>
                      <CompanyActions company={company} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {pages && pages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/admin/companies?page=${p}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}`}
                  className={`px-3 py-1 rounded ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
