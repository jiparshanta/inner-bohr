import { getAllPageContent, getAllServices, getAllFAQs } from "@/app/actions/content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Package, HelpCircle, Plus } from "lucide-react"
import { ContentEditor } from "./ContentEditor"
import { ServicesEditor } from "./ServicesEditor"
import { FAQsEditor } from "./FAQsEditor"
import { SeedContentButton } from "./SeedContentButton"
import Link from "next/link"

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const activeTab = params.tab || "pages"

  const [contentResult, servicesResult, faqsResult] = await Promise.all([
    getAllPageContent(),
    getAllServices(true),
    getAllFAQs(true),
  ])

  const content = "content" in contentResult ? contentResult.content : []
  const services = "services" in servicesResult ? servicesResult.services : []
  const faqs = "faqs" in faqsResult ? faqsResult.faqs : []

  // Group content by page
  const contentByPage: Record<string, typeof content> = {}
  content.forEach((item) => {
    if (!contentByPage[item.page]) {
      contentByPage[item.page] = []
    }
    contentByPage[item.page].push(item)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
          <p className="text-muted-foreground">Manage your website content, services, and FAQs</p>
        </div>
        {content.length === 0 && services.length === 0 && faqs.length === 0 && (
          <SeedContentButton />
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Link href="/admin/content?tab=pages">
          <Button variant={activeTab === "pages" ? "default" : "ghost"} size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Page Content ({content.length})
          </Button>
        </Link>
        <Link href="/admin/content?tab=services">
          <Button variant={activeTab === "services" ? "default" : "ghost"} size="sm">
            <Package className="mr-2 h-4 w-4" />
            Services ({services.length})
          </Button>
        </Link>
        <Link href="/admin/content?tab=faqs">
          <Button variant={activeTab === "faqs" ? "default" : "ghost"} size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            FAQs ({faqs.length})
          </Button>
        </Link>
      </div>

      {/* Tab Content */}
      {activeTab === "pages" && (
        <ContentEditor contentByPage={contentByPage} />
      )}

      {activeTab === "services" && (
        <ServicesEditor services={services} />
      )}

      {activeTab === "faqs" && (
        <FAQsEditor faqs={faqs} />
      )}
    </div>
  )
}
