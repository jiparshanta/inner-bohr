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
  SSF_EMPLOYEE_RATE,
  SSF_EMPLOYER_RATE,
  SSF_MAX_SALARY_CAP,
  formatNPR,
  calculateSlabTax,
} from "@/lib/tax-data"

export function SalaryTaxCalc() {
  const [monthlySalary, setMonthlySalary] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("single")
  const [ssfEnabled, setSsfEnabled] = useState("yes")
  const [result, setResult] = useState<{
    annualSalary: number
    annualSSFEmployee: number
    annualSSFEmployer: number
    taxableIncome: number
    annualTax: number
    monthlyTax: number
    monthlyTakeHome: number
    annualTakeHome: number
  } | null>(null)

  const calculate = () => {
    const monthly = parseFloat(monthlySalary) || 0
    if (monthly <= 0) return

    const annual = monthly * 12
    const slabs = maritalStatus === "married" ? INDIVIDUAL_TAX_SLABS_MARRIED : INDIVIDUAL_TAX_SLABS_SINGLE

    let annualSSFEmployee = 0
    let annualSSFEmployer = 0

    if (ssfEnabled === "yes") {
      const cappedSalary = Math.min(monthly, SSF_MAX_SALARY_CAP)
      annualSSFEmployee = cappedSalary * SSF_EMPLOYEE_RATE * 12
      annualSSFEmployer = cappedSalary * SSF_EMPLOYER_RATE * 12
    }

    const taxableIncome = Math.max(0, annual - annualSSFEmployee)
    const { total: annualTax } = calculateSlabTax(taxableIncome, slabs)
    const monthlyTax = annualTax / 12
    const monthlyTakeHome = monthly - (annualSSFEmployee / 12) - monthlyTax
    const annualTakeHome = annual - annualSSFEmployee - annualTax

    setResult({
      annualSalary: annual,
      annualSSFEmployee,
      annualSSFEmployer,
      taxableIncome,
      annualTax,
      monthlyTax,
      monthlyTakeHome,
      annualTakeHome,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Salary Tax Calculator</CardTitle>
        <CardDescription>Calculate monthly/annual tax and take-home pay from your salary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salary-monthly">Monthly Salary (NPR)</Label>
            <Input
              id="salary-monthly"
              type="number"
              placeholder="e.g. 80000"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
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
            <Label>SSF Contribution?</Label>
            <Select value={ssfEnabled} onValueChange={setSsfEnabled}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes (mandatory)</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-3">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Salary Breakdown</h4>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="flex justify-between sm:flex-col">
                <span className="text-muted-foreground">Annual Salary</span>
                <span className="font-medium">{formatNPR(result.annualSalary)}</span>
              </div>
              {result.annualSSFEmployee > 0 && (
                <>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-muted-foreground">SSF (Employee 11%)</span>
                    <span className="font-medium">{formatNPR(result.annualSSFEmployee)}/yr</span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-muted-foreground">SSF (Employer 20%)</span>
                    <span className="font-medium">{formatNPR(result.annualSSFEmployer)}/yr</span>
                  </div>
                </>
              )}
              <div className="flex justify-between sm:flex-col">
                <span className="text-muted-foreground">Taxable Income</span>
                <span className="font-medium">{formatNPR(result.taxableIncome)}</span>
              </div>
            </div>
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Annual Tax</span>
                <span className="font-semibold">{formatNPR(result.annualTax)}</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Tax</span>
                <span className="font-semibold">{formatNPR(result.monthlyTax)}</span>
              </div>
            </div>
            <div className="border-t border-brand-green pt-3 space-y-2">
              <div className="flex justify-between text-base font-bold text-brand-green-dark">
                <span>Monthly Take-Home</span>
                <span>{formatNPR(result.monthlyTakeHome)}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-green-dark">
                <span>Annual Take-Home</span>
                <span className="font-semibold">{formatNPR(result.annualTakeHome)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
