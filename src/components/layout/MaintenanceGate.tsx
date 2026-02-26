import { auth } from "@/lib/auth"
import { getMaintenanceMode } from "@/app/actions/admin"
import { Wrench } from "lucide-react"

export async function MaintenanceGate({ children }: { children: React.ReactNode }) {
  const { maintenanceMode } = await getMaintenanceMode()

  if (!maintenanceMode) {
    return <>{children}</>
  }

  // Allow admins through
  const session = await auth()
  if (session?.user?.role === "admin") {
    return (
      <>
        <div className="bg-yellow-500 text-white text-center text-sm py-1.5 font-medium">
          Maintenance mode is ON — only admins can see the site
        </div>
        {children}
      </>
    )
  }

  // Block everyone else with a maintenance page
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2D9CDB] to-[#34D399] flex items-center justify-center shadow-lg">
          <Wrench className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 font-[family-name:var(--font-sora)]">
            We&apos;ll Be Right Back
          </h1>
          <p className="text-gray-600 font-[family-name:var(--font-plus-jakarta-sans)]">
            EzDarta is currently undergoing scheduled maintenance.
            We&apos;re working hard to improve your experience.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">
            If you have an urgent query, please contact us at
          </p>
          <a
            href="mailto:support@ezdarta.np"
            className="text-[#2D9CDB] font-medium hover:text-[#1A6FA3] transition-colors"
          >
            support@ezdarta.np
          </a>
        </div>

        <p className="text-xs text-gray-400">
          हामी छिट्टै फर्कनेछौं। धन्यवाद!
        </p>
      </div>
    </div>
  )
}
