"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateSiteSettings } from "@/app/actions/admin"

type Settings = {
  id: string
  siteName: string
  siteDescription: string | null
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  registrationFee: number
  panRegistrationFee: number
  maintenanceMode: boolean
}

type Section = "general" | "contact" | "pricing" | "maintenance"

export function SiteSettingsForm({
  settings,
  section,
}: {
  settings: Settings | null
  section: Section
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // General settings state
  const [siteName, setSiteName] = useState(settings?.siteName || "")
  const [siteDescription, setSiteDescription] = useState(settings?.siteDescription || "")

  // Contact settings state
  const [contactEmail, setContactEmail] = useState(settings?.contactEmail || "")
  const [contactPhone, setContactPhone] = useState(settings?.contactPhone || "")
  const [address, setAddress] = useState(settings?.address || "")

  // Pricing settings state
  const [registrationFee, setRegistrationFee] = useState(settings?.registrationFee || 15000)
  const [panRegistrationFee, setPanRegistrationFee] = useState(settings?.panRegistrationFee || 5000)

  // Maintenance mode state
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    let data: Record<string, string | number | boolean> = {}

    switch (section) {
      case "general":
        data = { siteName, siteDescription }
        break
      case "contact":
        data = { contactEmail, contactPhone, address }
        break
      case "pricing":
        data = { registrationFee, panRegistrationFee }
        break
      case "maintenance":
        data = { maintenanceMode }
        break
    }

    const result = await updateSiteSettings(data as Parameters<typeof updateSiteSettings>[0])

    if ("error" in result && result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Settings updated successfully" })
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-3 text-sm rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {section === "general" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="NepalCompanyReg"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <textarea
                id="siteDescription"
                className="w-full p-2 border rounded-md text-sm min-h-[80px]"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                placeholder="The easiest way to register your company in Nepal"
              />
            </div>
          </div>
        </>
      )}

      {section === "contact" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="support@nepalcompanyreg.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+977-1-XXXXXXX"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Office Address</Label>
              <textarea
                id="address"
                className="w-full p-2 border rounded-md text-sm min-h-[60px]"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Kathmandu, Nepal"
              />
            </div>
          </div>
        </>
      )}

      {section === "pricing" && (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="registrationFee">Company Registration Fee (NPR)</Label>
              <Input
                id="registrationFee"
                type="number"
                value={registrationFee}
                onChange={(e) => setRegistrationFee(Number(e.target.value))}
                placeholder="15000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panRegistrationFee">PAN Registration Fee (NPR)</Label>
              <Input
                id="panRegistrationFee"
                type="number"
                value={panRegistrationFee}
                onChange={(e) => setPanRegistrationFee(Number(e.target.value))}
                placeholder="5000"
              />
            </div>
          </div>
        </>
      )}

      {section === "maintenance" && (
        <>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="maintenanceMode" className="text-sm">
              Enable Maintenance Mode
            </Label>
          </div>
          {maintenanceMode && (
            <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
              Warning: When maintenance mode is enabled, users will not be able to access the site.
              Only admins can view the site during maintenance.
            </p>
          )}
        </>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
