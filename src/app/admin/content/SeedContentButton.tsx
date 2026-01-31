"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { seedDefaultContent } from "@/app/actions/content"

export function SeedContentButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSeed = async () => {
    if (!confirm("This will create default content for your website. Continue?")) {
      return
    }

    setIsLoading(true)
    const result = await seedDefaultContent()

    if ("error" in result && result.error) {
      alert(result.error)
    } else {
      alert("Default content created successfully!")
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      <Sparkles className="mr-2 h-4 w-4" />
      {isLoading ? "Creating..." : "Create Default Content"}
    </Button>
  )
}
