import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FileText, Globe, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-24 md:py-32 lg:px-8 bg-gradient-to-b from-blue-50 to-white dark:from-sky-950 dark:to-background">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
            Register Your Company in <span className="text-blue-600">Nepal</span> Online
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground mb-8">
            The fastest, easiest way to register your Pvt. Ltd. company.
            We handle the OCR paperwork, document drafting, and filing so you can focus on business.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-blue-500/20">
                Start Registration
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Learn more <span aria-hidden="true">→</span>
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center justify-center gap-x-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>100% Online Process</span>
            </div>
            <div className="flex items-center gap-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Expert OCR Assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-slate-50 dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              We simplify the bureaucracy
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Don't get lost in paperwork. Our platform guides you through every step required by the Office of Company Registrar.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Auto-Generated Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    We automatically generate your Memorandum of Association (MOA) and Articles of Association (AOA) based on your inputs.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Remote Filing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Submit your details from anywhere. upload your citizenship, and we handle the physical submission and verification at OCR.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>Legal Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Ensure your company starts on the right foot with PAN registration guidance and initial compliance checklists.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
