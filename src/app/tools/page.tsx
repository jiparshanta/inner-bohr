import { Calculator } from "lucide-react"
import { TaxCalculators } from "@/components/tools/TaxCalculators"

export const metadata = {
  title: "Tax & Fee Calculators | EzDarta",
  description:
    "Free Nepal tax calculators — income tax, salary tax, corporate tax, VAT, TDS, capital gains, registration fees, SSF, and more.",
}

export default function ToolsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-20 lg:px-8 bg-gradient-to-b from-[#E8F5FD] to-white">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-brand-green p-3 text-white shadow-lg">
              <Calculator className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
            Tax &amp; Fee{" "}
            <span className="text-primary">Calculators</span>
          </h1>
          <p className="text-lg leading-8 text-muted-foreground font-medium">
            Nepal को tax estimation, सजिलो बनाउँदै
          </p>
          <p className="mt-2 text-base text-muted-foreground">
            Free tools to estimate your income tax, VAT, registration fees, and more — based on the latest Nepal tax rates (FY 2081/82).
          </p>
        </div>
      </section>

      {/* Calculators */}
      <TaxCalculators />
    </div>
  )
}
