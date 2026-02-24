"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TDS_RATES, formatNPR } from "@/lib/tax-data"

export function TDSCalc() {
  const [category, setCategory] = useState(TDS_RATES[0].category)
  const [amount, setAmount] = useState("")
  const [result, setResult] = useState<{
    rate: number
    tdsAmount: number
    netPayment: number
  } | null>(null)

  const calculate = () => {
    const value = parseFloat(amount) || 0
    if (value <= 0) return

    const rateObj = TDS_RATES.find((r) => r.category === category)
    const rate = rateObj?.rate || 0
    const tdsAmount = value * rate
    const netPayment = value - tdsAmount

    setResult({ rate, tdsAmount, netPayment })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">TDS Calculator</CardTitle>
        <CardDescription>Calculate Tax Deducted at Source for various payment types</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Payment Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TDS_RATES.map((r) => (
                  <SelectItem key={r.category} value={r.category}>
                    {r.category} ({(r.rate * 100).toFixed(1)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tds-amount">Payment Amount (NPR)</Label>
            <Input
              id="tds-amount"
              type="number"
              placeholder="e.g. 100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate TDS</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Result</h4>
            <div className="flex justify-between">
              <span>TDS Rate</span>
              <span className="font-medium">{(result.rate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span>TDS Amount to Deduct</span>
              <span className="font-semibold text-brand-crimson">{formatNPR(result.tdsAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Net Payment to Payee</span>
              <span>{formatNPR(result.netPayment)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
