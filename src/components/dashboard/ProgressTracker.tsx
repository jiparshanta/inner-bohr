import { Check, X } from "lucide-react"

type Stage = {
  key: string
  label: string
  hint: string
}

const STAGES: Stage[] = [
  { key: "submitted", label: "Submitted", hint: "Application received" },
  { key: "review", label: "Under Review", hint: "Documents being verified" },
  { key: "filed", label: "OCR Filed", hint: "Registration number assigned" },
  { key: "pan", label: "PAN Issued", hint: "Tax ID registered" },
  { key: "approved", label: "Approved", hint: "Company is live" },
]

type Props = {
  status: string
  registrationNumber: string | null
  panNumber: string | null
  submittedAt: Date
  rejectionReason: string | null
}

type StageState = "done" | "current" | "pending" | "rejected"

function computeStates({
  status,
  registrationNumber,
  panNumber,
  submittedAt,
}: Props): StageState[] {
  const isRejected = status === "rejected"
  const isApproved = status === "approved"
  const submittedHrsAgo = (Date.now() - new Date(submittedAt).getTime()) / 3_600_000

  const reachedReview =
    status === "under_review" || isApproved || isRejected || submittedHrsAgo > 24
  const reachedFiled = !!registrationNumber || isApproved
  const reachedPan = !!panNumber || isApproved
  const reachedApproved = isApproved

  const reached = [true, reachedReview, reachedFiled, reachedPan, reachedApproved]

  if (isRejected) {
    return reached.map((r, i) => {
      if (i === 0) return "done"
      if (i === 1) return "rejected"
      return "pending"
    })
  }

  return reached.map((r, i) => {
    if (r) return "done"
    const prevReached = reached[i - 1]
    return prevReached ? "current" : "pending"
  })
}

function StageDot({ state, index }: { state: StageState; index: number }) {
  if (state === "done") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-green text-white shadow-sm">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
    )
  }
  if (state === "current") {
    return (
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-blue text-white shadow-[0_4px_16px_rgba(45,156,219,0.35)]">
        <span className="text-sm font-semibold">{index + 1}</span>
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand-blue opacity-40" />
      </div>
    )
  }
  if (state === "rejected") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-crimson text-white shadow-sm">
        <X className="h-5 w-5" strokeWidth={3} />
      </div>
    )
  }
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
      <span className="text-sm font-semibold">{index + 1}</span>
    </div>
  )
}

function connectorColor(left: StageState, right: StageState) {
  if (left === "done" && (right === "done" || right === "current"))
    return "bg-brand-green"
  if (left === "rejected" || right === "rejected") return "bg-brand-crimson/40"
  return "bg-gray-200"
}

export function ProgressTracker(props: Props) {
  const states = computeStates(props)
  const isRejected = props.status === "rejected"

  return (
    <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="font-heading text-lg font-semibold text-gray-800">
          Registration Progress
        </h3>
        {isRejected ? (
          <span className="text-sm font-medium text-brand-crimson">
            Application rejected
          </span>
        ) : (
          <span className="text-sm text-gray-500">
            Step {Math.max(states.indexOf("current") + 1, states.lastIndexOf("done") + 1)} of {STAGES.length}
          </span>
        )}
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden md:block">
        <div className="flex items-start">
          {STAGES.map((stage, i) => (
            <div key={stage.key} className="flex flex-1 items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 0, flex: "0 0 auto" }}>
                <StageDot state={states[i]} index={i} />
                <div className="mt-2 max-w-[120px] text-center">
                  <p
                    className={`text-sm font-medium ${
                      states[i] === "pending" ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">{stage.hint}</p>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className={`mt-[18px] h-0.5 flex-1 ${connectorColor(
                    states[i],
                    states[i + 1]
                  )}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden">
        <ol className="space-y-4">
          {STAGES.map((stage, i) => (
            <li key={stage.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StageDot state={states[i]} index={i} />
                {i < STAGES.length - 1 && (
                  <div
                    className={`mt-1 h-8 w-0.5 ${connectorColor(states[i], states[i + 1])}`}
                  />
                )}
              </div>
              <div className="pb-2">
                <p
                  className={`text-sm font-medium ${
                    states[i] === "pending" ? "text-gray-400" : "text-gray-800"
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-gray-500">{stage.hint}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {isRejected && props.rejectionReason && (
        <div className="mt-5 rounded-lg border border-brand-crimson/20 bg-brand-crimson-light p-3">
          <p className="text-sm font-medium text-brand-crimson">Reason for rejection</p>
          <p className="mt-1 text-sm text-gray-700">{props.rejectionReason}</p>
        </div>
      )}
    </div>
  )
}
