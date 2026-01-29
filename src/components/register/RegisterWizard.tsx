"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NameReservationStep } from "./steps/NameReservationStep"
import { CompanyDetailsStep } from "./steps/CompanyDetailsStep"
import { AddOnServicesStep } from "./steps/AddOnServicesStep"
import { DocumentUploadStep } from "./steps/DocumentUploadStep"
import { DocumentGenerationStep } from "./steps/DocumentGenerationStep"
import { ReviewStep } from "./steps/ReviewStep"

export function RegisterWizard() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({})

    const nextStep = (data: object) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setStep((prev) => prev + 1)
    }

    const prevStep = () => {
        setStep((prev) => prev - 1)
    }

    // Step definitions
    // 1. Name Reservation
    // 2. Company Details
    // 3. Add-on Services
    // 4. Document Upload
    // 5. Document Generation (MOA/AOA)
    // 6. Review & Pay
    const TOTAL_STEPS = 6;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-2 rounded-full mx-1 ${step >= index + 1 ? "bg-blue-600" : "bg-slate-200"}`}
                    />
                ))}
            </div>

            <Card>
                <CardContent className="pt-6">
                    {step === 1 && <NameReservationStep onNext={nextStep} defaultValues={formData} />}
                    {step === 2 && <CompanyDetailsStep onNext={nextStep} onBack={prevStep} defaultValues={formData} />}
                    {step === 3 && <AddOnServicesStep onNext={nextStep} onBack={prevStep} defaultValues={formData} />}
                    {step === 4 && <DocumentUploadStep onNext={nextStep} onBack={prevStep} formData={formData} />}
                    {step === 5 && <DocumentGenerationStep onNext={nextStep} onBack={prevStep} formData={formData} />}
                    {step === 6 && <ReviewStep onBack={prevStep} formData={formData} />}
                </CardContent>
            </Card>
        </div>
    )
}
