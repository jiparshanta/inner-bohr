import { getAllPayments } from "@/app/actions/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { PaymentActions } from "./PaymentActions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  failed: { label: "Failed", className: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-700" },
}

const methodLabels: Record<string, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
  bank_transfer: "Bank Transfer",
  connectips: "ConnectIPS",
}

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const params = await searchParams
  const page = parseInt(params.page || "1")
  const status = params.status || ""

  const result = await getAllPayments(page, 10, status)

  if ("error" in result && result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const payments = "payments" in result ? result.payments : []
  const total = "total" in result ? result.total : 0
  const pages = "pages" in result ? result.pages : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payment Management</h2>
        <p className="text-muted-foreground">View and manage all payments ({total} total)</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/payments">
          <Button variant={!status ? "default" : "outline"} size="sm">All</Button>
        </Link>
        <Link href="/admin/payments?status=pending">
          <Button variant={status === "pending" ? "default" : "outline"} size="sm">Pending</Button>
        </Link>
        <Link href="/admin/payments?status=completed">
          <Button variant={status === "completed" ? "default" : "outline"} size="sm">Completed</Button>
        </Link>
        <Link href="/admin/payments?status=failed">
          <Button variant={status === "failed" ? "default" : "outline"} size="sm">Failed</Button>
        </Link>
        <Link href="/admin/payments?status=refunded">
          <Button variant={status === "refunded" ? "default" : "outline"} size="sm">Refunded</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            All Payments
          </CardTitle>
          <CardDescription>View payment transactions and update statuses</CardDescription>
        </CardHeader>
        <CardContent>
          {!payments || payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-8 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div>Date</div>
                <div>User</div>
                <div>Company</div>
                <div>Description</div>
                <div>Method</div>
                <div className="text-right">Amount</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Table Rows */}
              {payments.map((payment) => {
                const statusInfo = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending
                return (
                  <div
                    key={payment.id}
                    className="grid grid-cols-1 lg:grid-cols-8 gap-2 lg:gap-4 p-4 rounded-lg border items-center"
                  >
                    <div className="text-sm">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{payment.user?.name || "No name"}</p>
                      <p className="text-xs text-muted-foreground">{payment.user?.email}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.company?.name || "-"}
                    </div>
                    <div className="text-sm">
                      {payment.description || "Registration Fee"}
                    </div>
                    <div className="text-sm">
                      {payment.method ? methodLabels[payment.method] || payment.method : "-"}
                    </div>
                    <div className="text-right font-semibold">
                      NPR {payment.amount.toLocaleString()}
                    </div>
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div>
                      <PaymentActions payment={payment} />
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
                  href={`/admin/payments?page=${p}${status ? `&status=${status}` : ""}`}
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
