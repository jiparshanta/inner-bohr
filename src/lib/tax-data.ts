// Nepal Tax Data — FY 2081/82 and 2082/83
// Sources: IRD (ird.gov.np), Baker Tilly Nepal, Tax Advisor Nepal

export interface TaxSlab {
  min: number
  max: number | null
  rate: number
}

// --- 1. Individual Income Tax Slabs ---

export const INDIVIDUAL_TAX_SLABS_SINGLE: TaxSlab[] = [
  { min: 0, max: 500000, rate: 0.01 },
  { min: 500000, max: 700000, rate: 0.10 },
  { min: 700000, max: 1000000, rate: 0.20 },
  { min: 1000000, max: 2000000, rate: 0.30 },
  { min: 2000000, max: 5000000, rate: 0.36 },
  { min: 5000000, max: null, rate: 0.39 },
]

export const INDIVIDUAL_TAX_SLABS_MARRIED: TaxSlab[] = [
  { min: 0, max: 600000, rate: 0.01 },
  { min: 600000, max: 800000, rate: 0.10 },
  { min: 800000, max: 1100000, rate: 0.20 },
  { min: 1100000, max: 2000000, rate: 0.30 },
  { min: 2000000, max: 5000000, rate: 0.36 },
  { min: 5000000, max: null, rate: 0.39 },
]

export const FEMALE_TAX_REBATE = 0.10
export const SENIOR_CITIZEN_EXEMPTION = 50000
export const DISABILITY_EXTRA_EXEMPTION_FACTOR = 0.50

// Deduction limits
export const DEDUCTION_LIMITS = {
  retirementFund: { maxAmount: 500000, maxFraction: 1 / 3 },
  lifeInsurance: 40000,
  healthInsurance: 20000,
}

// --- 2. Corporate Tax Rates ---

export interface CorporateTaxRate {
  sector: string
  rate: number
}

export const CORPORATE_TAX_RATES: CorporateTaxRate[] = [
  { sector: "General companies (Pvt. Ltd / Public Ltd)", rate: 0.25 },
  { sector: "Banks & financial institutions", rate: 0.30 },
  { sector: "General insurance companies", rate: 0.30 },
  { sector: "Telecom & internet service providers", rate: 0.30 },
  { sector: "Petroleum industries", rate: 0.30 },
  { sector: "Merchant banking / money transfer", rate: 0.30 },
  { sector: "Capital markets / securities", rate: 0.30 },
  { sector: "Tobacco & alcohol companies", rate: 0.30 },
  { sector: "IT companies / software dev", rate: 0.20 },
  { sector: "Agriculture businesses", rate: 0.20 },
  { sector: "Tourism industry", rate: 0.20 },
  { sector: "Special industries & export income", rate: 0.20 },
]

export const CORPORATE_LOCATION_REBATES: Record<string, number> = {
  "remote": 0.30,
  "undeveloped": 0.20,
  "lessDeveloped": 0.10,
  "none": 0,
}

// --- 3. VAT ---

export const VAT_RATE = 0.13
export const VAT_THRESHOLD_GOODS = 5000000
export const VAT_THRESHOLD_SERVICES = 3000000

// --- 4. TDS Rates ---

export interface TDSCategory {
  category: string
  rate: number
}

export const TDS_RATES: TDSCategory[] = [
  { category: "Interest — foreign banks/institutions", rate: 0.10 },
  { category: "Interest — domestic banks/institutions", rate: 0.05 },
  { category: "Interest on deposits (natural persons)", rate: 0.05 },
  { category: "Vehicle rental (VAT-registered)", rate: 0.015 },
  { category: "Vehicle rental (non-VAT)", rate: 0.025 },
  { category: "Other lease/rent", rate: 0.10 },
  { category: "Royalty payment", rate: 0.15 },
  { category: "Service fees (VAT-registered)", rate: 0.015 },
  { category: "Service fees (non-VAT)", rate: 0.15 },
  { category: "Commission to non-resident", rate: 0.05 },
  { category: "Retirement fund payments", rate: 0.05 },
  { category: "Mutual funds / dividends", rate: 0.05 },
  { category: "Consultancy fees (VAT invoice)", rate: 0.015 },
  { category: "Consultancy fees (non-VAT)", rate: 0.15 },
  { category: "Satellite / bandwidth / telecom", rate: 0.10 },
  { category: "Lottery and contest prizes", rate: 0.25 },
  { category: "Contract payments (> Rs.50,000)", rate: 0.015 },
  { category: "Contract payment to non-residents", rate: 0.05 },
]

// --- 5. Capital Gains Tax ---

export interface CapitalGainsRate {
  entityType: "individual" | "company" | "non-resident"
  assetType: string
  holdingPeriod: string
  rate: number
}

export const CAPITAL_GAINS_RATES: CapitalGainsRate[] = [
  { entityType: "individual", assetType: "Land / building", holdingPeriod: "> 5 years", rate: 0.05 },
  { entityType: "individual", assetType: "Land / building", holdingPeriod: "≤ 5 years", rate: 0.075 },
  { entityType: "individual", assetType: "Listed shares (NEPSE)", holdingPeriod: "> 365 days", rate: 0.05 },
  { entityType: "individual", assetType: "Listed shares (NEPSE)", holdingPeriod: "≤ 365 days", rate: 0.075 },
  { entityType: "individual", assetType: "Unlisted shares", holdingPeriod: "Any", rate: 0.10 },
  { entityType: "company", assetType: "Listed shares", holdingPeriod: "Any", rate: 0.10 },
  { entityType: "company", assetType: "Unlisted shares", holdingPeriod: "Any", rate: 0.15 },
  { entityType: "non-resident", assetType: "Any", holdingPeriod: "Any", rate: 0.25 },
]

// --- 6. SSF Rates ---

export const SSF_EMPLOYEE_RATE = 0.11
export const SSF_EMPLOYER_RATE = 0.20
export const SSF_TOTAL_RATE = 0.31
export const SSF_MAX_SALARY_CAP = 350000

// --- 7. Small Business / Presumptive Tax ---

export interface PresumptiveTax {
  location: string
  annualTax: number
}

export const PRESUMPTIVE_TAX: PresumptiveTax[] = [
  { location: "Metropolitan / Sub-metropolitan", annualTax: 7500 },
  { location: "Municipality", annualTax: 4000 },
  { location: "Rural municipality", annualTax: 2500 },
]

export interface TurnoverTaxRate {
  businessType: string
  rate: number
}

export const TURNOVER_TAX_RATES: TurnoverTaxRate[] = [
  { businessType: "Gas / cigarette / low-margin", rate: 0.003 },
  { businessType: "Trade / products", rate: 0.01 },
  { businessType: "Services", rate: 0.02 },
]

export const SMALL_BIZ_PRESUMPTIVE_LIMIT = 3000000
export const SMALL_BIZ_TURNOVER_LIMIT = 10000000

// --- 8. Freelancer Tax ---

export const FREELANCER_FOREIGN_RATE = 0.05
export const FREELANCER_REGISTRATION_THRESHOLD = 4000000

// --- 9. Registration Fees ---

export interface RegistrationFeeSlab {
  min: number
  max: number | null
  fee: number
  perLakh?: number
}

export const REGISTRATION_FEES_PRIVATE: RegistrationFeeSlab[] = [
  { min: 0, max: 100000, fee: 1000 },
  { min: 100000, max: 500000, fee: 4500 },
  { min: 500000, max: 2500000, fee: 9500 },
  { min: 2500000, max: 10000000, fee: 16000 },
  { min: 10000000, max: 20000000, fee: 19000 },
  { min: 20000000, max: 30000000, fee: 22000 },
  { min: 30000000, max: 40000000, fee: 25000 },
  { min: 40000000, max: 50000000, fee: 28000 },
  { min: 50000000, max: 60000000, fee: 31000 },
  { min: 60000000, max: 70000000, fee: 34000 },
  { min: 70000000, max: 80000000, fee: 37000 },
  { min: 80000000, max: 90000000, fee: 40000 },
  { min: 90000000, max: 100000000, fee: 43000 },
  { min: 100000000, max: null, fee: 0, perLakh: 30 },
]

export const REGISTRATION_FEES_PUBLIC: RegistrationFeeSlab[] = [
  { min: 0, max: 10000000, fee: 15000 },
  { min: 10000000, max: 100000000, fee: 40000 },
  { min: 100000000, max: 200000000, fee: 70000 },
  { min: 200000000, max: 300000000, fee: 100000 },
  { min: 300000000, max: 400000000, fee: 130000 },
  { min: 400000000, max: 500000000, fee: 160000 },
  { min: 500000000, max: null, fee: 160000, perLakh: 30 },
]

// --- Helper: Format NPR ---

export function formatNPR(amount: number): string {
  if (amount === 0) return "NPR 0"
  const isNegative = amount < 0
  const abs = Math.abs(Math.round(amount))
  const str = abs.toString()
  let result = ""
  const len = str.length

  if (len <= 3) {
    result = str
  } else {
    result = str.slice(-3)
    let remaining = str.slice(0, -3)
    while (remaining.length > 2) {
      result = remaining.slice(-2) + "," + result
      remaining = remaining.slice(0, -2)
    }
    if (remaining.length > 0) {
      result = remaining + "," + result
    }
  }

  return (isNegative ? "-" : "") + "NPR " + result
}

// --- Helper: Calculate tax from slabs ---

export function calculateSlabTax(income: number, slabs: TaxSlab[]): { total: number; breakdown: { slab: string; taxableAmount: number; rate: number; tax: number }[] } {
  let remaining = income
  const breakdown: { slab: string; taxableAmount: number; rate: number; tax: number }[] = []
  let total = 0

  for (const slab of slabs) {
    if (remaining <= 0) break
    const slabWidth = slab.max !== null ? slab.max - slab.min : Infinity
    const taxableInSlab = Math.min(remaining, slabWidth)
    const tax = taxableInSlab * slab.rate

    const slabLabel = slab.max !== null
      ? `${formatNPR(slab.min)} – ${formatNPR(slab.max)}`
      : `Above ${formatNPR(slab.min)}`

    breakdown.push({
      slab: slabLabel,
      taxableAmount: taxableInSlab,
      rate: slab.rate,
      tax,
    })

    total += tax
    remaining -= taxableInSlab
  }

  return { total, breakdown }
}
