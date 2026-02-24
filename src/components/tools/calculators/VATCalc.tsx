"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VAT_RATE, formatNPR } from "@/lib/tax-data"

export function VATCalc() {
  const [amount, setAmount] = useState("")
  const [direction, setDirection] = useState("add")
  const [result, setResult] = useState<{
    baseAmount: number
    vatAmount: number
    totalAmount: number
  } | null>(null)

  const calculate = () => {
    const value = parseFloat(amount) || 0
    if (value <= 0) return

    if (direction === "add") {
      const vatAmount = value * VAT_RATE
      setResult({ baseAmount: value, vatAmount, totalAmount: value + vatAmount })
    } else {
      const baseAmount = value / (1 + VAT_RATE)
      const vatAmount = value - baseAmount
      setResult({ baseAmount, vatAmount, totalAmount: value })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">VAT Calculator</CardTitle>
        <CardDescription>Add or extract 13% VAT from any amount</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="vat-amount">Amount (NPR)</Label>
            <Input
              id="vat-amount"
              type="number"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="add">Add VAT (exclusive → inclusive)</SelectItem>
                <SelectItem value="extract">Extract VAT (inclusive → exclusive)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate VAT</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-2 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Result</h4>
            <div className="flex justify-between">
              <span>Base Amount (excl. VAT)</span>
              <span className="font-medium">{formatNPR(result.baseAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>VAT (13%)</span>
              <span className="font-medium">{formatNPR(result.vatAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Total (incl. VAT)</span>
              <span>{formatNPR(result.totalAmount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
