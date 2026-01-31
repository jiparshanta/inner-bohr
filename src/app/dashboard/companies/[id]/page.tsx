import { getCompanyById, deleteCompany } from "@/app/actions/companies"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react"
import { DeleteCompanyButton } from "./DeleteCompanyButton"

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    description: "Your application is waiting to be reviewed by our team.",
  },
  under_review: {
    label: "Under Review",
    icon: AlertCircle,
    className: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Our team is currently reviewing your application.",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border-green-200",
    description: "Your company has been successfully registered.",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200",
    description: "Unfortunately, your application was rejected.",
  },
}

const companyTypes: Record<string, string> = {
  pvt_ltd: "Private Limited Company",
  public_ltd: "Public Limited Company",
  partnership: "Partnership Firm",
  sole_proprietorship: "Sole Proprietorship",
}

export default async function CompanyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCompanyById(id)

  if (result.error || !result.company) {
    notFound()
  }

  const company = result.company
  const status = statusConfig[company.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon
  const selectedServices = company.selectedServices ? JSON.parse(company.selectedServices) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/companies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{company.name}</h2>
          {company.nameNepali && (
            <p className="text-muted-foreground">{company.nameNepali}</p>
          )}
        </div>
        {company.status !== "approved" && (
          <DeleteCompanyButton companyId={company.id} companyName={company.name} />
        )}
      </div>

      {/* Status Card */}
      <Card className={status.className}>
        <CardContent className="flex items-center gap-4 py-4">
          <StatusIcon className="h-8 w-8" />
          <div>
            <h3 className="font-semibold text-lg">{status.label}</h3>
            <p className="text-sm opacity-90">{status.description}</p>
            {company.status === "rejected" && company.rejectionReason && (
              <p className="text-sm mt-2">
                <strong>Reason:</strong> {company.rejectionReason}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic details about your company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Type</p>
                <p className="font-medium">{companyTypes[company.type] || company.type}</p>
              </div>
              {company.registrationNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Registration Number</p>
                  <p className="font-medium">{company.registrationNumber}</p>
                </div>
              )}
              {company.panNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">PAN Number</p>
                  <p className="font-medium">{company.panNumber}</p>
                </div>
              )}
              {company.capital && (
                <div>
                  <p className="text-sm text-muted-foreground">Authorized Capital</p>
                  <p className="font-medium">NPR {company.capital}</p>
                </div>
              )}
            </div>
            {company.businessObjectives && (
              <div>
                <p className="text-sm text-muted-foreground">Business Objectives</p>
                <p className="font-medium">{company.businessObjectives}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Registered Address</CardTitle>
            <CardDescription>Company's official address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.address ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{company.address}</p>
                </div>
                {company.district && (
                  <div>
                    <p className="text-sm text-muted-foreground">District</p>
                    <p className="font-medium">{company.district}</p>
                  </div>
                )}
                {company.municipality && (
                  <div>
                    <p className="text-sm text-muted-foreground">Municipality</p>
                    <p className="font-medium">{company.municipality}</p>
                  </div>
                )}
                {company.wardNo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Ward No.</p>
                    <p className="font-medium">{company.wardNo}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No address provided</p>
            )}
          </CardContent>
        </Card>

        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Add-on Services</CardTitle>
              <CardDescription>Additional services selected during registration</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedServices.map((service: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Application progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Application Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(company.submittedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              {company.approvedAt && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium">Application Approved</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(company.approvedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
              {company.rejectedAt && (
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <div>
                    <p className="font-medium">Application Rejected</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(company.rejectedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payments */}
        {company.payments && company.payments.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Payments made for this company registration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {company.payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{payment.description || "Registration Fee"}</p>
                      <p className="text-sm text-muted-foreground">
                        {payment.method} - {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">NPR {payment.amount.toLocaleString()}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          payment.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
