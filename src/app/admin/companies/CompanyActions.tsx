"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
} from "lucide-react"
import { updateCompanyStatus } from "@/app/actions/admin"
import { useRouter } from "next/navigation"

type Company = {
  id: string
  name: string
  status: string
  registrationNumber: string | null
}

export function CompanyActions({ company }: { company: Company }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [regNumber, setRegNumber] = useState("")
  const [panNumber, setPanNumber] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const handleStatusChange = async (
    status: "pending" | "under_review" | "approved" | "rejected",
    data?: { registrationNumber?: string; panNumber?: string; rejectionReason?: string }
  ) => {
    setIsLoading(true)
    const result = await updateCompanyStatus(company.id, status, data)
    if ("error" in result && result.error) {
      alert(result.error)
    }
    setIsLoading(false)
    setIsOpen(false)
    setShowApprove(false)
    setShowReject(false)
    router.refresh()
  }

  if (showApprove) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Approve Company</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Approving: <strong>{company.name}</strong>
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="regNumber">Registration Number *</Label>
              <Input
                id="regNumber"
                placeholder="REG-2024-XXXXX"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="panNumber">PAN Number (Optional)</Label>
              <Input
                id="panNumber"
                placeholder="123456789"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowApprove(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleStatusChange("approved", { registrationNumber: regNumber, panNumber })}
              disabled={isLoading || !regNumber}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? "Approving..." : "Approve"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (showReject) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Reject Company</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Rejecting: <strong>{company.name}</strong>
          </p>
          <div>
            <Label htmlFor="reason">Rejection Reason *</Label>
            <textarea
              id="reason"
              className="w-full mt-1 p-2 border rounded-md text-sm min-h-[100px]"
              placeholder="Please provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowReject(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleStatusChange("rejected", { rejectionReason })}
              disabled={isLoading || !rejectionReason}
            >
              {isLoading ? "Rejecting..." : "Reject"}
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
              <a
                href={`/dashboard/companies/${company.id}`}
                target="_blank"
                className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted"
              >
                <Eye className="h-4 w-4" />
                View Details
              </a>
              {company.status !== "under_review" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-blue-600"
                  onClick={() => {
                    handleStatusChange("under_review")
                    setIsOpen(false)
                  }}
                >
                  <Search className="h-4 w-4" />
                  Mark Under Review
                </button>
              )}
              {company.status !== "approved" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-green-600"
                  onClick={() => {
                    setShowApprove(true)
                    setIsOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </button>
              )}
              {company.status !== "rejected" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-red-600"
                  onClick={() => {
                    setShowReject(true)
                    setIsOpen(false)
                  }}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              )}
              {company.status !== "pending" && (
                <button
                  className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted text-yellow-600"
                  onClick={() => {
                    handleStatusChange("pending")
                    setIsOpen(false)
                  }}
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
