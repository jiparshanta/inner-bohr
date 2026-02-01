import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  Users,
  Award,
  Clock,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react"

const stats = [
  { label: "Companies Registered", value: "500+", icon: Building2 },
  { label: "Happy Clients", value: "450+", icon: Users },
  { label: "Years Experience", value: "5+", icon: Award },
  { label: "Processing Time", value: "7-10 Days", icon: Clock },
]

const team = [
  {
    name: "Rajesh Sharma",
    role: "Founder & CEO",
    description: "10+ years of experience in company law and compliance in Nepal.",
  },
  {
    name: "Sunita Thapa",
    role: "Head of Operations",
    description: "Former OCR officer with deep knowledge of registration processes.",
  },
  {
    name: "Bikash Adhikari",
    role: "Legal Advisor",
    description: "Corporate lawyer specializing in business law and foreign investment.",
  },
]

const values = [
  {
    title: "Transparency",
    description: "Clear pricing with no hidden fees. You know exactly what you're paying for.",
  },
  {
    title: "Efficiency",
    description: "We leverage technology and expertise to process registrations faster.",
  },
  {
    title: "Reliability",
    description: "Every application is handled with care and attention to detail.",
  },
  {
    title: "Support",
    description: "Our team is always available to answer your questions and concerns.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-sky-950 dark:to-background">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
            About NepalCompanyReg
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            We're on a mission to make company registration in Nepal simple, fast, and hassle-free.
            No more confusing paperwork or endless office visits.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              Our Story
            </h2>
          </div>
          <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground">
            <p className="text-center">
              NepalCompanyReg was founded in 2019 with a simple goal: to eliminate the frustration
              of company registration in Nepal. Our founders experienced firsthand the challenges
              of navigating the bureaucratic maze at the Office of Company Registrar.
            </p>
            <p className="text-center mt-4">
              Today, we've helped hundreds of entrepreneurs and businesses establish their
              companies in Nepal. Our team combines legal expertise with modern technology
              to deliver a seamless registration experience.
            </p>
            <p className="text-center mt-4">
              Whether you're a first-time entrepreneur, an established business expanding operations,
              or a foreign investor looking to enter the Nepali market, we're here to guide you
              every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Experienced professionals dedicated to your success.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-blue-600 mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">info@nepalcompanyreg.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+977-1-4123456</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">Putalisadak, Kathmandu</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-4">
            Ready to start your company?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of entrepreneurs who've trusted us with their company registration.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Registration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
