"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CORPORATE_TAX_RATES, CORPORATE_LOCATION_REBATES, formatNPR } from "@/lib/tax-data"

export function CorporateTaxCalc() {
  const [sector, setSector] = useState(CORPORATE_TAX_RATES[0].sector)
  const [profit, setProfit] = useState("")
  const [location, setLocation] = useState("none")
  const [result, setResult] = useState<{
    rate: number
    rebatePercent: number
    effectiveRate: number
    grossTax: number
    rebateAmount: number
    netTax: number
  } | null>(null)

  const calculate = () => {
    const annualProfit = parseFloat(profit) || 0
    if (annualProfit <= 0) return

    const rateObj = CORPORATE_TAX_RATES.find((r) => r.sector === sector)
    const rate = rateObj?.rate || 0.25
    const rebatePercent = CORPORATE_LOCATION_REBATES[location] || 0

    const grossTax = annualProfit * rate
    const rebateAmount = grossTax * rebatePercent
    const effectiveRate = rate * (1 - rebatePercent)
    const netTax = grossTax - rebateAmount

    setResult({ rate, rebatePercent, effectiveRate, grossTax, rebateAmount, netTax })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Corporate Tax Calculator</CardTitle>
        <CardDescription>Calculate corporate income tax by sector and location (FY 2081/82)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Business Sector</Label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CORPORATE_TAX_RATES.map((r) => (
                  <SelectItem key={r.sector} value={r.sector}>
                    {r.sector} ({(r.rate * 100).toFixed(0)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="corp-profit">Annual Taxable Profit (NPR)</Label>
            <Input
              id="corp-profit"
              type="number"
              placeholder="e.g. 5000000"
              value={profit}
              onChange={(e) => setProfit(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Location Rebate</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No rebate</SelectItem>
                <SelectItem value="lessDeveloped">Less developed (10%)</SelectItem>
                <SelectItem value="undeveloped">Undeveloped (20%)</SelectItem>
                <SelectItem value="remote">Remote area (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate Tax</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Result</h4>
            <div className="flex justify-between">
              <span>Tax Rate</span>
              <span className="font-medium">{(result.rate * 100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Tax</span>
              <span className="font-medium">{formatNPR(result.grossTax)}</span>
            </div>
            {result.rebatePercent > 0 && (
              <div className="flex justify-between text-brand-green">
                <span>Location Rebate ({(result.rebatePercent * 100).toFixed(0)}%)</span>
                <span className="font-medium">-{formatNPR(result.rebateAmount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Net Corporate Tax</span>
              <span>{formatNPR(result.netTax)}</span>
            </div>
            {result.rebatePercent > 0 && (
              <div className="text-xs text-muted-foreground">
                Effective rate: {(result.effectiveRate * 100).toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
