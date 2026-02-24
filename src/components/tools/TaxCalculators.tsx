"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Calculator, Receipt, Building2, Percent, Scissors, TrendingUp, FileText, Users, Store, Laptop } from "lucide-react"
import { PersonalIncomeTaxCalc } from "./calculators/PersonalIncomeTaxCalc"
import { SalaryTaxCalc } from "./calculators/SalaryTaxCalc"
import { CorporateTaxCalc } from "./calculators/CorporateTaxCalc"
import { VATCalc } from "./calculators/VATCalc"
import { TDSCalc } from "./calculators/TDSCalc"
import { CapitalGainsTaxCalc } from "./calculators/CapitalGainsTaxCalc"
import { RegistrationFeeCalc } from "./calculators/RegistrationFeeCalc"
import { SSFCalc } from "./calculators/SSFCalc"
import { SmallBusinessTaxCalc } from "./calculators/SmallBusinessTaxCalc"
import { FreelancerTaxCalc } from "./calculators/FreelancerTaxCalc"

const CALCULATORS = [
  { id: "personal-income-tax", label: "Personal Income Tax", icon: Calculator, component: PersonalIncomeTaxCalc },
  { id: "salary-tax", label: "Salary Tax", icon: Receipt, component: SalaryTaxCalc },
  { id: "corporate-tax", label: "Corporate Tax", icon: Building2, component: CorporateTaxCalc },
  { id: "vat", label: "VAT", icon: Percent, component: VATCalc },
  { id: "tds", label: "TDS", icon: Scissors, component: TDSCalc },
  { id: "capital-gains", label: "Capital Gains Tax", icon: TrendingUp, component: CapitalGainsTaxCalc },
  { id: "registration-fee", label: "Registration Fee", icon: FileText, component: RegistrationFeeCalc },
  { id: "ssf", label: "SSF Contribution", icon: Users, component: SSFCalc },
  { id: "small-business", label: "Small Business Tax", icon: Store, component: SmallBusinessTaxCalc },
  { id: "freelancer", label: "Freelancer Tax", icon: Laptop, component: FreelancerTaxCalc },
]

export function TaxCalculators() {
  const [activeId, setActiveId] = useState(CALCULATORS[0].id)
  const active = CALCULATORS.find((c) => c.id === activeId) || CALCULATORS[0]
  const ActiveComponent = active.component

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-8 md:py-12">
      {/* Mobile: horizontal scrollable pills */}
      <div className="md:hidden mb-6 -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-2 pb-2 min-w-max">
          {CALCULATORS.map((calc) => {
            const Icon = calc.icon
            return (
              <button
                key={calc.id}
                onClick={() => setActiveId(calc.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeId === calc.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white border border-border text-muted-foreground hover:text-primary hover:border-primary"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {calc.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop: sidebar + main */}
      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <nav className="sticky top-20 space-y-1">
            {CALCULATORS.map((calc) => {
              const Icon = calc.icon
              return (
                <button
                  key={calc.id}
                  onClick={() => setActiveId(calc.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    activeId === calc.id
                      ? "bg-[#E8F5FD] text-primary"
                      : "text-muted-foreground hover:bg-[#F8FAFC] hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {calc.label}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main calculator area */}
        <main className="flex-1 min-w-0">
          <ActiveComponent />
        </main>
      </div>
    </div>
  )
}
