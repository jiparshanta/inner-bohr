"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatNPR } from "@/lib/tax-data"

const CGT_OPTIONS = [
  { label: "Land / Building (held > 5 years)", entityType: "individual" as const, rate: 0.05 },
  { label: "Land / Building (held ≤ 5 years)", entityType: "individual" as const, rate: 0.075 },
  { label: "Listed Shares — NEPSE (held > 365 days)", entityType: "individual" as const, rate: 0.05 },
  { label: "Listed Shares — NEPSE (held ≤ 365 days)", entityType: "individual" as const, rate: 0.075 },
  { label: "Unlisted Shares (Individual)", entityType: "individual" as const, rate: 0.10 },
  { label: "Listed Shares (Company)", entityType: "company" as const, rate: 0.10 },
  { label: "Unlisted Shares (Company)", entityType: "company" as const, rate: 0.15 },
  { label: "Any Asset (Non-Resident)", entityType: "non-resident" as const, rate: 0.25 },
]

export function CapitalGainsTaxCalc() {
  const [optionIndex, setOptionIndex] = useState("0")
  const [buyPrice, setBuyPrice] = useState("")
  const [sellPrice, setSellPrice] = useState("")
  const [result, setResult] = useState<{
    gain: number
    rate: number
    tax: number
    netProceeds: number
  } | null>(null)

  const calculate = () => {
    const buy = parseFloat(buyPrice) || 0
    const sell = parseFloat(sellPrice) || 0
    if (sell <= 0) return

    const option = CGT_OPTIONS[parseInt(optionIndex)]
    const gain = Math.max(0, sell - buy)
    const tax = gain * option.rate
    const netProceeds = sell - tax

    setResult({ gain, rate: option.rate, tax, netProceeds })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Capital Gains Tax Calculator</CardTitle>
        <CardDescription>Calculate CGT on sale of property, shares, or other assets</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Asset Type &amp; Holding Period</Label>
            <Select value={optionIndex} onValueChange={setOptionIndex}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CGT_OPTIONS.map((opt, i) => (
                  <SelectItem key={i} value={String(i)}>
                    {opt.label} — {(opt.rate * 100).toFixed(1)}%
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cgt-buy">Purchase Price (NPR)</Label>
            <Input
              id="cgt-buy"
              type="number"
              placeholder="e.g. 1000000"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cgt-sell">Sale Price (NPR)</Label>
            <Input
              id="cgt-sell"
              type="number"
              placeholder="e.g. 1500000"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate CGT</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Result</h4>
            <div className="flex justify-between">
              <span>Capital Gain</span>
              <span className="font-medium">{formatNPR(result.gain)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGT Rate</span>
              <span className="font-medium">{(result.rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between text-brand-crimson">
              <span>Capital Gains Tax</span>
              <span className="font-semibold">{formatNPR(result.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Net Proceeds</span>
              <span>{formatNPR(result.netProceeds)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
