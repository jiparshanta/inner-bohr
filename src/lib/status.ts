import { Clock, AlertCircle, CheckCircle, XCircle, type LucideIcon } from "lucide-react"

export type CompanyStatus = "pending" | "under_review" | "approved" | "rejected"

export type StatusVisual = {
  label: string
  description: string
  icon: LucideIcon
  badgeClass: string
  cardClass: string
}

export const statusVisuals: Record<CompanyStatus, StatusVisual> = {
  pending: {
    label: "Pending Review",
    description: "Your application is waiting to be reviewed by our team.",
    icon: Clock,
    badgeClass: "bg-[#E8F5FD] text-[#1A6FA3] border-[#2D9CDB]/30",
    cardClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  under_review: {
    label: "Under Review",
    description: "Our team is currently reviewing your application.",
    icon: AlertCircle,
    badgeClass: "bg-[#E8F5FD] text-[#1A6FA3] border-[#2D9CDB]/50",
    cardClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  approved: {
    label: "Approved",
    description: "Your company has been successfully registered.",
    icon: CheckCircle,
    badgeClass: "bg-[#ECFDF5] text-[#059669] border-[#34D399]/30",
    cardClass: "bg-green-50 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    description: "Unfortunately, your application was rejected.",
    icon: XCircle,
    badgeClass: "bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]/30",
    cardClass: "bg-red-50 text-red-700 border-red-200",
  },
}

export function getStatusVisual(status: string): StatusVisual {
  return statusVisuals[status as CompanyStatus] ?? statusVisuals.pending
}
