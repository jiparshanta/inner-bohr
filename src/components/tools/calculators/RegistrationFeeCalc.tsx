"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  REGISTRATION_FEES_PRIVATE,
  REGISTRATION_FEES_PUBLIC,
  formatNPR,
} from "@/lib/tax-data"
import type { RegistrationFeeSlab } from "@/lib/tax-data"

function lookupFee(capital: number, slabs: RegistrationFeeSlab[]): number {
  for (const slab of slabs) {
    if (slab.max === null) {
      if (capital > slab.min) {
        if (slab.perLakh) {
          const lakhs = Math.ceil(capital / 100000)
          return slab.fee + lakhs * slab.perLakh
        }
        return slab.fee
      }
    }
    if (capital > slab.min && capital <= (slab.max || Infinity)) {
      return slab.fee
    }
  }
  return 0
}

export function RegistrationFeeCalc() {
  const [companyType, setCompanyType] = useState("private")
  const [capital, setCapital] = useState("")
  const [result, setResult] = useState<{
    registrationFee: number
    publicationFee: number
    totalFee: number
  } | null>(null)

  const calculate = () => {
    const authorizedCapital = parseFloat(capital) || 0
    if (authorizedCapital <= 0) return

    const slabs = companyType === "private" ? REGISTRATION_FEES_PRIVATE : REGISTRATION_FEES_PUBLIC
    const registrationFee = lookupFee(authorizedCapital, slabs)
    const publicationFee = companyType === "private" ? 500 : 1000
    const totalFee = registrationFee + publicationFee

    setResult({ registrationFee, publicationFee, totalFee })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Registration Fee Calculator</CardTitle>
        <CardDescription>Estimate OCR registration fees for your company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Company Type</Label>
            <Select value={companyType} onValueChange={setCompanyType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private Limited</SelectItem>
                <SelectItem value="public">Public Limited</SelectItem>
                <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-capital">Authorized Capital (NPR)</Label>
            <Input
              id="reg-capital"
              type="number"
              placeholder="e.g. 1000000"
              value={capital}
              onChange={(e) => setCapital(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate Fees</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Fee Breakdown</h4>
            <div className="flex justify-between">
              <span>Registration Fee (OCR)</span>
              <span className="font-medium">{formatNPR(result.registrationFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Publication Fee</span>
              <span className="font-medium">{formatNPR(result.publicationFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Total Registration Cost</span>
              <span>{formatNPR(result.totalFee)}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Note: Additional costs may include PAN certificate (NPR 100-200), stamp duty, and legal fees.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
