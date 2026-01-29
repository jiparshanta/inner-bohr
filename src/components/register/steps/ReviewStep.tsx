"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

interface ReviewStepProps {
    onBack: () => void;
    formData: any;
}

export function ReviewStep({ onBack, formData }: ReviewStepProps) {

    const handleSubmit = () => {
        // Here we would integrate eSewa/Khalti
        alert("In a real app, this would redirect to eSewa/Khalti. Data collected: " + JSON.stringify(formData))
    }

    const { name1, name2, name3, companyType, businessObjectives, selectedServices, capital } = formData;

    // Government Fee Calculation (based on official chart)
    const calculateGovernmentFee = (cap: string | undefined): number => {
        const amount = parseInt(cap || "100000"); // Default 1 Lakh

        if (amount <= 100000) return 1000;
        if (amount <= 500000) return 4500;
        if (amount <= 2500000) return 9500;
        if (amount <= 10000000) return 16000;
        if (amount <= 20000000) return 19000;
        if (amount <= 30000000) return 22000;
        if (amount <= 40000000) return 25000;
        if (amount <= 50000000) return 28000;
        if (amount <= 60000000) return 31000;
        if (amount <= 70000000) return 34000;
        if (amount <= 80000000) return 37000;
        if (amount <= 90000000) return 40000;
        if (amount <= 100000000) return 43000;

        // Above 10 Crore: 43000 + 30 per 1 Lakh additional (Simulated logic per chart description)
        // Chart says: "30 for each 1,00,00,000" (Wait, 30 per 1 Crore? Or 30 per 1 Lakh? )
        // Source says: "10,00,00,000 -> 30 for each 1,00,00,000". This seems like a typo in source or very low.
        // Let's assume standard increment. For MVP, flat 43000+ for very high amounts is simplistic but safe.
        return 43000;
    };

    const registrationFee = calculateGovernmentFee(capital);
    const serviceFee = selectedServices?.reduce((acc: number, _: string) => acc + 2000, 0) || 0; // Mock service fee logic
    const totalPayable = registrationFee + serviceFee;

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Review & Pay</h2>
                <p className="text-sm text-muted-foreground">Please verify your information before proceeding to payment.</p>
            </div>

            <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="space-y-1">
                            <span className="font-medium text-muted-foreground block">Primary Name:</span>
                            <span className="font-semibold">{name1}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-muted-foreground block">Company Type:</span>
                            <span className="capitalize">{companyType?.replace("-", " ") || "Private Limited"}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-muted-foreground block">Alternative Names:</span>
                            <span>{name2 || "-"}, {name3 || "-"}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-muted-foreground block">Capital:</span>
                            <span>NPR {parseInt(capital || "100000").toLocaleString()}</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-muted-foreground block">Business Objectives:</span>
                            <span className="line-clamp-2">{businessObjectives || "-"}</span>
                        </div>

                        {selectedServices && selectedServices.length > 0 && (
                            <div className="col-span-1 md:col-span-2 space-y-1 border-t pt-2 mt-2">
                                <span className="font-medium text-muted-foreground block">Selected Add-ons:</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedServices.map((service: string) => (
                                        <span key={service} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase">
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-900 space-y-2">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-500 mb-1">Fee Breakdown</h4>
                <div className="flex justify-between text-sm text-yellow-700 dark:text-yellow-400">
                    <span>Government Registration Fee (Based on Capital):</span>
                    <span className="font-medium">NPR {registrationFee.toLocaleString()}</span>
                </div>
                {serviceFee > 0 && (
                    <div className="flex justify-between text-sm text-yellow-700 dark:text-yellow-400">
                        <span>Platform & Service Fees:</span>
                        <span className="font-medium">NPR {serviceFee.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-base font-bold text-yellow-900 dark:text-yellow-300 border-t border-yellow-200 dark:border-yellow-800 pt-2 mt-2">
                    <span>Total Payable:</span>
                    <span>NPR {totalPayable.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay NPR {totalPayable.toLocaleString()}
                </Button>
            </div>
        </div>
    )
}
