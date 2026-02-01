import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, ArrowRight } from "lucide-react"

const pricingPlans = [
  {
    name: "Basic",
    description: "Essential company registration for startups",
    price: "15,000",
    currency: "NPR",
    popular: false,
    features: [
      "Pvt. Ltd. company registration",
      "Name reservation",
      "MOA & AOA drafting",
      "OCR submission",
      "Registration certificate",
      "Email support",
    ],
    notIncluded: [
      "PAN registration",
      "Bank account assistance",
      "Priority processing",
    ],
  },
  {
    name: "Standard",
    description: "Complete registration with PAN",
    price: "20,000",
    currency: "NPR",
    popular: true,
    features: [
      "Everything in Basic",
      "PAN registration",
      "Tax compliance setup",
      "Document notarization",
      "Phone support",
      "30-day post-registration support",
    ],
    notIncluded: [
      "Bank account assistance",
      "Priority processing",
    ],
  },
  {
    name: "Premium",
    description: "Full-service registration package",
    price: "30,000",
    currency: "NPR",
    popular: false,
    features: [
      "Everything in Standard",
      "Bank account opening assistance",
      "Priority processing",
      "Dedicated account manager",
      "Company stamp & letterhead",
      "90-day post-registration support",
      "Annual compliance reminder",
    ],
    notIncluded: [],
  },
]

const addOnServices = [
  { name: "Additional Director", price: "2,000" },
  { name: "Foreign Director Approval", price: "5,000" },
  { name: "Share Capital Increase", price: "3,000" },
  { name: "Address Change", price: "2,500" },
  { name: "Annual Return Filing", price: "5,000" },
  { name: "Company Search Report", price: "1,500" },
]

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-sky-950 dark:to-background">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Choose the package that fits your needs. All prices include government fees and our service charges.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`flex flex-col h-full relative ${
                  plan.popular ? "border-blue-600 border-2 shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.currency} {plan.price}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start text-sm">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start text-sm text-muted-foreground">
                        <span className="h-5 w-5 mr-2 flex-shrink-0 flex items-center justify-center">
                          <span className="h-1 w-3 bg-muted-foreground/50 rounded" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/register" className="w-full">
                    <Button
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              Add-on Services
            </h2>
            <p className="text-lg text-muted-foreground">
              Enhance your registration with additional services as needed.
            </p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addOnServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border"
                  >
                    <span className="font-medium">{service.name}</span>
                    <span className="text-blue-600 font-semibold">NPR {service.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            Have questions?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Our team is here to help you understand the registration process and choose the right package.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Registration
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
