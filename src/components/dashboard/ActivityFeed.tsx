import { getCompanyActivities } from "@/app/actions/activities"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CheckCircle,
  FileText,
  AlertCircle,
  CreditCard,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

type Props = {
  companyId: string
  fallbackSubmittedAt: Date
}

const ICONS: Record<string, { icon: LucideIcon; tone: string }> = {
  submitted: { icon: FileText, tone: "bg-brand-blue-light text-brand-blue" },
  status_change: { icon: AlertCircle, tone: "bg-brand-blue-light text-brand-blue" },
  registration_filed: { icon: CheckCircle, tone: "bg-brand-green-light text-brand-green-dark" },
  pan_issued: { icon: Sparkles, tone: "bg-brand-green-light text-brand-green-dark" },
  document_uploaded: { icon: FileText, tone: "bg-gray-100 text-gray-600" },
  payment_received: { icon: CreditCard, tone: "bg-brand-green-light text-brand-green-dark" },
  note_added: { icon: AlertCircle, tone: "bg-gray-100 text-gray-600" },
}

function relativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime()
  const sec = Math.round(diffMs / 1000)
  if (sec < 60) return "just now"
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} min ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} hr ago`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day} day${day === 1 ? "" : "s"} ago`
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export async function ActivityFeed({ companyId, fallbackSubmittedAt }: Props) {
  const result = await getCompanyActivities(companyId)
  const fetched = "activities" in result ? result.activities ?? [] : []

  // If error or empty (pre-migration data), show a single fallback row
  const activities =
    fetched.length > 0
      ? fetched
      : [
          {
            id: "fallback",
            type: "submitted",
            title: "Application submitted",
            message: null as string | null,
            actorRole: "user",
            createdAt: fallbackSubmittedAt,
          },
        ]

  return (
    <Card className="md:col-span-2 shadow-sm">
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Recent updates on this application</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {activities.map((a, i) => {
            const cfg = ICONS[a.type] ?? ICONS.note_added
            const Icon = cfg.icon
            const isLast = i === activities.length - 1
            return (
              <li key={a.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${cfg.tone}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {!isLast && <div className="mt-1 w-px flex-1 bg-gray-200" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-medium text-gray-800">{a.title}</p>
                    <span className="shrink-0 text-xs text-gray-500">
                      {relativeTime(a.createdAt)}
                    </span>
                  </div>
                  {a.message && (
                    <p className="mt-1 text-sm text-gray-600">{a.message}</p>
                  )}
                  <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
                    {a.actorRole === "admin" ? "EzDarta team" : a.actorRole === "system" ? "System" : "You"}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
