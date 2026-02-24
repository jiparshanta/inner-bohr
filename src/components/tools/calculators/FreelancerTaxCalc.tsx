"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  INDIVIDUAL_TAX_SLABS_SINGLE,
  FREELANCER_FOREIGN_RATE,
  formatNPR,
  calculateSlabTax,
} from "@/lib/tax-data"

export function FreelancerTaxCalc() {
  const [incomeSource, setIncomeSource] = useState("foreign")
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState<{
    tax: number
    rate: string
    netIncome: number
    note: string
  } | null>(null)

  const calculate = () => {
    const income = parseFloat(amount) || 0
    if (income <= 0) return

    if (incomeSource === "foreign") {
      const tax = income * FREELANCER_FOREIGN_RATE
      setResult({
        tax,
        rate: "5% (flat, final withholding)",
        netIncome: income - tax,
        note: "Foreign income received via bank transfer is subject to 5% flat tax (final withholding).",
      })
    } else {
      const { total: tax } = calculateSlabTax(income, INDIVIDUAL_TAX_SLABS_SINGLE)
      setResult({
        tax,
        rate: "Standard PIT slab rates",
        netIncome: income - tax,
        note: "Domestic freelance income is taxed at standard individual income tax slab rates.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Freelancer Tax Calculator</CardTitle>
        <CardDescription>Calculate tax on freelance income (foreign vs. domestic)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Income Source</Label>
            <Select value={incomeSource} onValueChange={setIncomeSource}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="foreign">Foreign (via bank transfer)</SelectItem>
                <SelectItem value="domestic">Domestic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="freelance-amount">Annual Income (NPR)</Label>
            <Input
              id="freelance-amount"
              type="number"
              placeholder="e.g. 1200000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate Tax</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Result</h4>
            <div className="flex justify-between">
              <span>Tax Rate</span>
              <span className="font-medium">{result.rate}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Payable</span>
              <span className="font-semibold text-brand-crimson">{formatNPR(result.tax)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Net Income</span>
              <span>{formatNPR(result.netIncome)}</span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">{result.note}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
