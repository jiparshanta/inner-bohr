import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  Sparkles,
  FileText,
  ShieldCheck,
  Building2,
  Receipt,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  filetext: FileText,
  shieldcheck: ShieldCheck,
  building2: Building2,
  receipt: Receipt,
}

function pickIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles
  return ICON_MAP[name.toLowerCase().replace(/[^a-z0-9]/g, "")] ?? Sparkles
}

export async function UpsellCards() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    take: 3,
  })

  if (services.length === 0) return null

  return (
    <section className="space-y-3">
      <div>
        <h3 className="font-heading text-xl font-semibold text-gray-800">
          Grow your business
        </h3>
        <p className="text-sm text-muted-foreground">
          Add-on services to keep your company compliant and ahead.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => {
          const Icon = pickIcon(service.icon)
          return (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="h-1 w-full bg-gradient-to-r from-brand-blue to-brand-green" />
              <div className="space-y-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue-light text-brand-blue">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-semibold text-gray-800">
                    {service.name}
                  </h4>
                  {service.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {service.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-2">
                  {service.price ? (
                    <p className="text-sm">
                      <span className="font-semibold text-gray-800">
                        NPR {service.price.toLocaleString()}
                      </span>
                    </p>
                  ) : (
                    <span className="text-sm text-gray-500">Get a quote</span>
                  )}
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-blue hover:text-brand-blue-dark"
                  >
                    Learn more
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
