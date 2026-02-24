"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  SSF_EMPLOYEE_RATE,
  SSF_EMPLOYER_RATE,
  SSF_MAX_SALARY_CAP,
  formatNPR,
} from "@/lib/tax-data"

export function SSFCalc() {
  const [basicSalary, setBasicSalary] = useState("")
  const [result, setResult] = useState<{
    cappedSalary: number
    employeeContribution: number
    employerContribution: number
    totalContribution: number
    annualEmployee: number
    annualEmployer: number
    annualTotal: number
  } | null>(null)

  const calculate = () => {
    const salary = parseFloat(basicSalary) || 0
    if (salary <= 0) return

    const cappedSalary = Math.min(salary, SSF_MAX_SALARY_CAP)
    const employeeContribution = cappedSalary * SSF_EMPLOYEE_RATE
    const employerContribution = cappedSalary * SSF_EMPLOYER_RATE
    const totalContribution = employeeContribution + employerContribution

    setResult({
      cappedSalary,
      employeeContribution,
      employerContribution,
      totalContribution,
      annualEmployee: employeeContribution * 12,
      annualEmployer: employerContribution * 12,
      annualTotal: totalContribution * 12,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">SSF Contribution Calculator</CardTitle>
        <CardDescription>Calculate Social Security Fund contributions (employee &amp; employer)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 max-w-sm">
          <Label htmlFor="ssf-salary">Monthly Basic Salary (NPR)</Label>
          <Input
            id="ssf-salary"
            type="number"
            placeholder="e.g. 50000"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Max salary cap: {formatNPR(SSF_MAX_SALARY_CAP)}/month
          </p>
        </div>

        <Button onClick={calculate} className="w-full sm:w-auto">Calculate SSF</Button>

        {result && (
          <div className="mt-6 rounded-xl border bg-[#F8FAFC] p-4 space-y-3 text-sm">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Monthly Contributions</h4>
            {result.cappedSalary < (parseFloat(basicSalary) || 0) && (
              <p className="text-xs text-amber-600">
                Salary capped at {formatNPR(SSF_MAX_SALARY_CAP)} for SSF calculation
              </p>
            )}
            <div className="flex justify-between">
              <span>Employee (11%)</span>
              <span className="font-medium">{formatNPR(result.employeeContribution)}</span>
            </div>
            <div className="flex justify-between">
              <span>Employer (20%)</span>
              <span className="font-medium">{formatNPR(result.employerContribution)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total Monthly (31%)</span>
              <span>{formatNPR(result.totalContribution)}</span>
            </div>

            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide pt-2">Annual Contributions</h4>
            <div className="flex justify-between">
              <span>Employee</span>
              <span className="font-medium">{formatNPR(result.annualEmployee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Employer</span>
              <span className="font-medium">{formatNPR(result.annualEmployer)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-brand-green text-base font-bold text-brand-green-dark">
              <span>Total Annual</span>
              <span>{formatNPR(result.annualTotal)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
