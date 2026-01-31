import { getSiteSettings } from "@/app/actions/admin"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Globe, Phone, CreditCard, AlertTriangle } from "lucide-react"
import { SiteSettingsForm } from "./SiteSettingsForm"

export default async function AdminSettingsPage() {
  const result = await getSiteSettings()

  if ("error" in result && result.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const settings = "settings" in result ? result.settings : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Site Settings</h2>
        <p className="text-muted-foreground">Configure your platform settings</p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic site configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm settings={settings} section="general" />
          </CardContent>
        </Card>

        {/* Contact Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>How users can reach you</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm settings={settings} section="contact" />
          </CardContent>
        </Card>

        {/* Pricing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing Configuration
            </CardTitle>
            <CardDescription>Set registration fees and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm settings={settings} section="pricing" />
          </CardContent>
        </Card>

        {/* Maintenance Mode */}
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Mode
            </CardTitle>
            <CardDescription>
              Enable maintenance mode to temporarily disable the site for users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SiteSettingsForm settings={settings} section="maintenance" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
