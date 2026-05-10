import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Item = {
  label: string
  done: boolean
  href: string
  cta: string
}

export async function OnboardingChecklist() {
  const session = await auth()
  if (!session?.user?.id) return null

  const userId = session.user.id

  const [user, companies, completedPaymentCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    }),
    prisma.company.findMany({
      where: { userId },
      select: { id: true, status: true, selectedServices: true },
    }),
    prisma.payment.count({
      where: { userId, status: "completed" },
    }),
  ])

  const hasApproved = companies.some((c) => c.status === "approved")
  const isNew =
    companies.length === 0 ||
    (companies.length === 1 && companies[0].status === "pending")
  if (!isNew || hasApproved) return null

  const hasCompany = companies.length > 0
  const hasServices = companies.some(
    (c) => c.selectedServices && JSON.parse(c.selectedServices).length > 0
  )

  const items: Item[] = [
    {
      label: "Verify your email",
      done: !!user?.emailVerified,
      href: "/dashboard/settings",
      cta: "Verify",
    },
    {
      label: "Register your first company",
      done: hasCompany,
      href: "/register",
      cta: "Start",
    },
    {
      label: "Select required add-on services",
      done: hasServices,
      href: hasCompany ? `/dashboard/companies/${companies[0].id}` : "/register",
      cta: "Add",
    },
    {
      label: "Complete your registration payment",
      done: completedPaymentCount > 0,
      href: "/dashboard/payments",
      cta: "Pay",
    },
  ]

  const doneCount = items.filter((i) => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)

  return (
    <Card className="border-brand-blue/20 bg-gradient-to-br from-brand-blue-light to-white shadow-sm">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <CardTitle className="font-heading text-xl">Get started</CardTitle>
            <CardDescription>
              Finish these steps to register your business with EzDarta.
            </CardDescription>
          </div>
          <span className="shrink-0 text-sm font-medium text-brand-blue-dark">
            {doneCount} of {items.length} done
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/70">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-green transition-[width] duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-brand-blue/10">
          {items.map((item) => (
            <li
              key={item.label}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="flex items-center gap-3">
                {item.done ? (
                  <CheckCircle2 className="h-5 w-5 text-brand-green" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
                <span
                  className={
                    item.done
                      ? "text-gray-500 line-through"
                      : "font-medium text-gray-800"
                  }
                >
                  {item.label}
                </span>
              </div>
              {!item.done && (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-blue-dark"
                >
                  {item.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
