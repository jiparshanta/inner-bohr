"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  INDIVIDUAL_TAX_SLABS_SINGLE,
  INDIVIDUAL_TAX_SLABS_MARRIED,
  FEMALE_TAX_REBATE,
  SENIOR_CITIZEN_EXEMPTION,
  DISABILITY_EXTRA_EXEMPTION_FACTOR,
  formatNPR,
  calculateSlabTax,
} from "@/lib/tax-data"

export function PersonalIncomeTaxCalc() {
  const [income, setIncome] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("single")
  const [gender, setGender] = useState("male")
  const [isSenior, setIsSenior] = useState("no")
  const [isDisabled, setIsDisabled] = useState("no")
  const [result, setResult] = useState<{
    taxableIncome: number
    breakdown: { slab: string; taxableAmount: number; rate: number; tax: number }[]
    grossTax: number
    rebate: number
    netTax: number
  } | null>(null)

  const calculate = () => {
    let annualIncome = parseFloat(income) || 0
    if (annualIncome <= 0) return

    const slabs = maritalStatus === "married" ? INDIVIDUAL_TAX_SLABS_MARRIED : INDIVIDUAL_TAX_SLABS_SINGLE

    let taxableIncome = annualIncome

    if (isSenior === "yes") {
      taxableIncome = Math.max(0, taxableIncome - SENIOR_CITIZEN_EXEMPTION)
    }

    if (isDisabled === "yes") {
      const baseThreshold = slabs[0].max || 500000
      const extraExemption = baseThreshold * DISABILITY_EXTRA_EXEMPTION_FACTOR
      taxableIncome = Math.max(0, taxableIncome - extraExemption)
    }

    const { total: grossTax, breakdown } = calculateSlabTax(taxableIncome, slabs)

    let rebate = 0
    if (gender === "female") {
      rebate = grossTax * FEMALE_TAX_REBATE
    }

    const netTax = Math.max(0, grossTax - rebate)

    setResult({ taxableIncome, breakdown, grossTax, rebate, netTax })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personal Income Tax Calculator</CardTitle>
        <CardDescription>Calculate your annual income tax based on Nepal&apos;s PIT slabs (FY 2081/82)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pit-income">Annual Taxable Income (NPR)</Label>
            <Input
              id="pit-income"
              type="number"
              placeholder="e.g. 800000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Marital Status</Label>
            <Select value={maritalStatus} onValueChange={setMaritalStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Senior Citizen (60+)?</Label>
            <Select value={isSenior} onValueChange={setIsSenior}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Person with Disability?</Label>
            <Select value={isDisabled} onValueChange={setIsDisabled}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate Tax</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Tax Breakdown</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-2 pr-4">Slab</th>
                    <th className="pb-2 pr-4 text-right">Taxable Amount</th>
                    <th className="pb-2 pr-4 text-right">Rate</th>
                    <th className="pb-2 text-right">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {result.breakdown.map((row, i) => (
                    <tr key={i} className="border-b border-dashed">
                      <td className="py-2 pr-4 whitespace-nowrap">{row.slab}</td>
                      <td className="py-2 pr-4 text-right">{formatNPR(row.taxableAmount)}</td>
                      <td className="py-2 pr-4 text-right">{(row.rate * 100).toFixed(0)}%</td>
                      <td className="py-2 text-right">{formatNPR(row.tax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-1 pt-2 border-t text-sm">
              <div className="flex justify-between">
                <span>Taxable Income</span>
                <span className="font-medium">{formatNPR(result.taxableIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gross Tax</span>
                <span className="font-medium">{formatNPR(result.grossTax)}</span>
              </div>
              {result.rebate > 0 && (
                <div className="flex justify-between text-brand-green">
                  <span>Female Rebate (10%)</span>
                  <span className="font-medium">-{formatNPR(result.rebate)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-brand-green text-brand-green-dark">
                <span>Net Tax Payable</span>
                <span>{formatNPR(result.netTax)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
