import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  FileText,
  Scale,
  Stamp,
  Users,
  Globe,
  ShieldCheck,
  FileSearch,
  Landmark,
  ArrowRight,
} from "lucide-react"

const services = [
  {
    icon: Building2,
    title: "Company Registration",
    description: "Complete Pvt. Ltd. company registration with the Office of Company Registrar (OCR). We handle all paperwork and submissions.",
    features: [
      "Name reservation and approval",
      "MOA & AOA drafting",
      "OCR submission and follow-up",
      "Registration certificate collection",
    ],
  },
  {
    icon: Stamp,
    title: "PAN Registration",
    description: "Get your Permanent Account Number (PAN) from the Inland Revenue Department for tax purposes.",
    features: [
      "PAN application preparation",
      "Document compilation",
      "IRD submission",
      "PAN certificate collection",
    ],
  },
  {
    icon: FileText,
    title: "Document Drafting",
    description: "Professional drafting of all legal documents required for company registration and operations.",
    features: [
      "Memorandum of Association",
      "Articles of Association",
      "Board resolutions",
      "Shareholder agreements",
    ],
  },
  {
    icon: Scale,
    title: "Legal Compliance",
    description: "Ensure your company meets all legal requirements and stays compliant with Nepali law.",
    features: [
      "Annual compliance filing",
      "Regulatory updates",
      "Compliance audits",
      "Legal advisory",
    ],
  },
  {
    icon: Users,
    title: "Directorship Changes",
    description: "Handle changes in company directors, shareholders, and other structural modifications.",
    features: [
      "Director appointments",
      "Share transfers",
      "Address changes",
      "Capital modifications",
    ],
  },
  {
    icon: Globe,
    title: "Foreign Investment",
    description: "Specialized services for foreign nationals and NRNs looking to invest in Nepal.",
    features: [
      "FDI approvals",
      "DOI registration",
      "Repatriation guidance",
      "Joint venture setup",
    ],
  },
  {
    icon: Landmark,
    title: "Bank Account Opening",
    description: "Assistance with opening corporate bank accounts at major Nepali banks.",
    features: [
      "Documentation preparation",
      "Bank liaison",
      "Account setup guidance",
      "Multi-signatory setup",
    ],
  },
  {
    icon: FileSearch,
    title: "Due Diligence",
    description: "Comprehensive company search and verification services for investors and partners.",
    features: [
      "Company status verification",
      "Director background checks",
      "Financial health assessment",
      "Compliance history review",
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-sky-950 dark:to-background">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            Our Services
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Comprehensive company registration and compliance services tailored for Nepal.
            From name reservation to PAN registration, we handle everything.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <service.icon className="h-10 w-10 text-blue-600 mb-3" />
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your company registration today and let us handle the complexities.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
