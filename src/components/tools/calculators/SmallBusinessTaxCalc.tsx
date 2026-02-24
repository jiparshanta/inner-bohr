"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PRESUMPTIVE_TAX,
  TURNOVER_TAX_RATES,
  SMALL_BIZ_PRESUMPTIVE_LIMIT,
  SMALL_BIZ_TURNOVER_LIMIT,
  formatNPR,
} from "@/lib/tax-data"

export function SmallBusinessTaxCalc() {
  const [turnover, setTurnover] = useState("")
  const [location, setLocation] = useState(PRESUMPTIVE_TAX[0].location)
  const [businessType, setBusinessType] = useState(TURNOVER_TAX_RATES[0].businessType)
  const [result, setResult] = useState<{
    regime: string
    tax: number
    rate?: number
    note: string
  } | null>(null)

  const calculate = () => {
    const annualTurnover = parseFloat(turnover) || 0
    if (annualTurnover <= 0) return

    if (annualTurnover <= SMALL_BIZ_PRESUMPTIVE_LIMIT) {
      const locData = PRESUMPTIVE_TAX.find((p) => p.location === location)
      setResult({
        regime: "Presumptive Tax",
        tax: locData?.annualTax || 7500,
        note: `Flat annual tax for turnover up to ${formatNPR(SMALL_BIZ_PRESUMPTIVE_LIMIT)}`,
      })
    } else if (annualTurnover <= SMALL_BIZ_TURNOVER_LIMIT) {
      const typeData = TURNOVER_TAX_RATES.find((t) => t.businessType === businessType)
      const rate = typeData?.rate || 0.01
      const tax = annualTurnover * rate
      setResult({
        regime: "Turnover-Based Tax",
        tax,
        rate,
        note: `Applied to turnover between ${formatNPR(SMALL_BIZ_PRESUMPTIVE_LIMIT)} and ${formatNPR(SMALL_BIZ_TURNOVER_LIMIT)}`,
      })
    } else {
      setResult({
        regime: "Standard Tax",
        tax: 0,
        note: `Turnover exceeds ${formatNPR(SMALL_BIZ_TURNOVER_LIMIT)}. Standard corporate/individual tax rules apply.`,
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Small Business Tax Calculator</CardTitle>
        <CardDescription>Calculate presumptive or turnover-based tax for small businesses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sb-turnover">Annual Turnover (NPR)</Label>
            <Input
              id="sb-turnover"
              type="number"
              placeholder="e.g. 2000000"
              value={turnover}
              onChange={(e) => setTurnover(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRESUMPTIVE_TAX.map((p) => (
                  <SelectItem key={p.location} value={p.location}>
                    {p.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Business Type (for turnover tax)</Label>
            <Select value={businessType} onValueChange={setBusinessType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TURNOVER_TAX_RATES.map((t) => (
                  <SelectItem key={t.businessType} value={t.businessType}>
                    {t.businessType} ({(t.rate * 100).toFixed(2)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate Tax</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">{result.regime}</h4>
            {result.rate !== undefined && (
              <div className="flex justify-between">
                <span>Tax Rate</span>
                <span className="font-medium">{(result.rate * 100).toFixed(2)}%</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Tax Payable</span>
              <span>{formatNPR(result.tax)}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">{result.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
