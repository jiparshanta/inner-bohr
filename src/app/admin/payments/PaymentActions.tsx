"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreHorizontal, CheckCircle, XCircle, RefreshCw, Clock } from "lucide-react"
import { updatePaymentStatus } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

type Payment = {
  id: string
  status: string
  transactionId: string | null
}

export function PaymentActions({ payment }: { payment: Payment }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showComplete, setShowComplete] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  const handleStatusChange = async (
    status: "pending" | "completed" | "failed" | "refunded",
    txnId?: string
  ) => {
    setIsLoading(true)
    const result = await updatePaymentStatus(payment.id, status, txnId)
    if ("error" in result && result.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setIsOpen(false)
    setShowComplete(false)
    router.refresh()
  }

  if (showComplete) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Mark Payment as Completed</h3>
          <div>
            <Label htmlFor="txnId">Transaction ID *</Label>
            <Input
              id="txnId"
              placeholder="TXN-XXXXXXX"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowComplete(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusChange("completed", transactionId)}
              disabled={isLoading || !transactionId}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Updating..." : "Complete"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-md border bg-white shadow-lg dark:bg-slate-800">
            <div className="p-1">
              {payment.status !== "completed" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-green-600"
                  onClick={() => {
                    setShowComplete(true)
                    setIsOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Mark Completed
                </button>
              )}
              {payment.status !== "failed" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-red-600"
                  onClick={() => handleStatusChange("failed")}
                >
                  <XCircle className="h-4 w-4" />
                  Mark Failed
                </button>
              )}
              {payment.status === "completed" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-orange-600"
                  onClick={() => handleStatusChange("refunded")}
                >
                  <RefreshCw className="h-4 w-4" />
                  Mark Refunded
                </button>
              )}
              {payment.status !== "pending" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-yellow-600"
                  onClick={() => handleStatusChange("pending")}
                >
                  <Clock className="h-4 w-4" />
                  Reset to Pending
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
