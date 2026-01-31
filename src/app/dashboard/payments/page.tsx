import { getUserPayments, getPaymentStats } from "@/app/actions/payments"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle, Receipt } from "lucide-react"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700",
  },
  failed: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-100 text-red-700",
  },
  refunded: {
    label: "Refunded",
    icon: Receipt,
    className: "bg-gray-100 text-gray-700",
  },
}

const methodLabels: Record<string, string> = {
  esewa: "eSewa",
  khalti: "Khalti",
  bank_transfer: "Bank Transfer",
  connectips: "ConnectIPS",
}

export default async function PaymentsPage() {
  const [paymentsResult, statsResult] = await Promise.all([
    getUserPayments(),
    getPaymentStats(),
  ])

  if (paymentsResult.error || statsResult.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{paymentsResult.error || statsResult.error}</p>
      </div>
    )
  }

  const payments = paymentsResult.payments || []
  const stats = statsResult.stats || { totalPaid: 0, pendingAmount: 0, completedCount: 0 }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Payments</h2>
        <p className="text-muted-foreground">View your payment history and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR {stats.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedCount} completed transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">NPR {stats.pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">eSewa, Khalti</div>
            <p className="text-xs text-muted-foreground">Available options</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All your payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
              <p className="text-muted-foreground text-center">
                Your payment history will appear here once you make a payment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                <div>Date</div>
                <div>Description</div>
                <div>Company</div>
                <div>Method</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>

              {/* Table Rows */}
              {payments.map((payment) => {
                const status = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending
                const StatusIcon = status.icon

                return (
                  <div
                    key={payment.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="md:hidden text-sm text-muted-foreground">Date</div>
                    <div className="text-sm">
                      {new Date(payment.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>

                    <div className="md:hidden text-sm text-muted-foreground mt-2">Description</div>
                    <div className="font-medium">{payment.description || "Registration Fee"}</div>

                    <div className="md:hidden text-sm text-muted-foreground mt-2">Company</div>
                    <div className="text-sm text-muted-foreground">
                      {payment.company?.name || "-"}
                    </div>

                    <div className="md:hidden text-sm text-muted-foreground mt-2">Method</div>
                    <div className="text-sm">
                      {payment.method ? methodLabels[payment.method] || payment.method : "-"}
                    </div>

                    <div className="md:hidden text-sm text-muted-foreground mt-2">Amount</div>
                    <div className="text-right font-semibold">
                      NPR {payment.amount.toLocaleString()}
                    </div>

                    <div className="md:hidden text-sm text-muted-foreground mt-2">Status</div>
                    <div className="flex justify-start md:justify-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                      >
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
          <CardDescription>How payments work on NepalCompanyReg</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Accepted Methods
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>eSewa Digital Wallet</li>
                <li>Khalti Digital Wallet</li>
                <li>ConnectIPS</li>
                <li>Bank Transfer</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Refund Policy
              </h4>
              <p className="text-sm text-muted-foreground">
                Refunds are processed within 7-10 business days for rejected applications.
                Service fees are non-refundable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
