"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Define the available services
const ADD_ON_SERVICES = [
    {
        id: "tax-filing",
        title: "Tax Filing & PAN/VAT Registration",
        description: "We handle your initial PAN/VAT registration and first-month filing.",
        price: "NPR 5,000"
    },
    {
        id: "bookkeeping",
        title: "Monthly Bookkeeping",
        description: "Professional accounting services to keep your ledger clean and compliant.",
        price: "NPR 3,000/mo"
    },
    {
        id: "digital-signature",
        title: "Digital Signature (DSC)",
        description: "Procurement of Class 2/3 Digital Signature for online filings.",
        price: "NPR 2,500"
    },
    {
        id: "legal-consultation",
        title: "Legal Consultation",
        description: "1-hour session with a corporate lawyer for compliance advice.",
        price: "NPR 4,000"
    },
    {
        id: "branding",
        title: "Logo & Branding Kit",
        description: "Get a professional logo and basic brand guidelines for your new company.",
        price: "NPR 10,000"
    }
]

interface AddOnServicesFormData {
    selectedServices: string[];
}

interface AddOnServicesStepProps {
    onNext: (data: AddOnServicesFormData) => void;
    onBack: () => void;
    defaultValues: Partial<AddOnServicesFormData>;
}

export function AddOnServicesStep({ onNext, onBack, defaultValues }: AddOnServicesStepProps) {
    const { control, handleSubmit } = useForm<AddOnServicesFormData>({
        defaultValues: {
            selectedServices: defaultValues.selectedServices || []
        }
    })

    const onSubmit = (data: AddOnServicesFormData) => {
        onNext(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Boost Your Business with Add-ons</h2>
                <p className="text-sm text-muted-foreground">Select additional services to kickstart your operations smoothly.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Controller
                    control={control}
                    name="selectedServices"
                    render={({ field }) => (
                        <>
                            {ADD_ON_SERVICES.map((service) => {
                                const isSelected = field.value?.includes(service.id);
                                return (
                                    <div
                                        key={service.id}
                                        className={cn(
                                            "flex items-start space-x-4 border rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-50",
                                            isSelected ? "border-blue-500 bg-blue-50/50" : "border-slate-200"
                                        )}
                                        onClick={() => {
                                            const newValue = isSelected
                                                ? field.value.filter((id) => id !== service.id)
                                                : [...(field.value || []), service.id];
                                            field.onChange(newValue);
                                        }}
                                    >
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={(checked: boolean | "indeterminate") => {
                                                const finalChecked = checked === true;
                                                const newValue = finalChecked
                                                    ? [...(field.value || []), service.id]
                                                    : field.value.filter((id) => id !== service.id);
                                                field.onChange(newValue);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            id={service.id}
                                            className="mt-1"
                                        />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between">
                                                <Label htmlFor={service.id} className="font-medium cursor-pointer">
                                                    {service.title}
                                                </Label>
                                                <span className="text-sm font-semibold text-blue-600">{service.price}</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                />
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit">
                    Continue to Review
                </Button>
            </div>
        </form>
    )
}
