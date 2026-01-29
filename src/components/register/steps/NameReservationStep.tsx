"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { checkNameAvailability, NameCheckResult } from "@/app/actions/check-name"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

// Define the form data type
interface NameReservationFormData {
    name1: string;
    name2?: string;
    name3?: string;
    nameNepali: string;
    companyType: string;
    businessObjectives: string;
}

interface NameReservationStepProps {
    onNext: (data: NameReservationFormData) => void;
    defaultValues: Partial<NameReservationFormData>;
}

export function NameReservationStep({ onNext, defaultValues }: NameReservationStepProps) {
    const { register, handleSubmit, watch, control, formState: { errors } } = useForm<NameReservationFormData>({
        defaultValues: {
            companyType: "private-limited",
            ...defaultValues
        }
    })
    const [checking, setChecking] = useState(false)

    // Watch the first name input
    const name1 = watch("name1")
    const debouncedName1 = useDebounce(name1, 800)
    const [name1Status, setName1Status] = useState<NameCheckResult | null>(null)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        if (name1) {
            setIsTyping(true)
            setName1Status(null)
        }
    }, [name1])

    useEffect(() => {
        const verifyName = async () => {
            if (!debouncedName1 || debouncedName1.length < 3) {
                setIsTyping(false)
                return
            }

            setChecking(true)
            try {
                const result = await checkNameAvailability(debouncedName1)
                setName1Status(result)
            } catch (error) {
                console.error("Failed to check name", error)
            } finally {
                setChecking(false)
                setIsTyping(false)
            }
        }

        verifyName()
    }, [debouncedName1])

    const onSubmit = (data: NameReservationFormData) => {
        // Prevent submission if the main name is unavailable
        if (name1Status && !name1Status.available) {
            return
        }
        onNext(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Reserve Your Company Name</h2>
                <p className="text-sm text-muted-foreground">Propose 3 names in order of preference. We check the first one instantly!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <Label htmlFor="name1">Proposed Name 1 (Primary Choice)</Label>
                        <div className="relative">
                            <Input
                                id="name1"
                                placeholder="e.g. Everest Tech Solutions Pvt. Ltd."
                                {...register("name1", { required: true, minLength: 3 })}
                                className={cn(
                                    name1Status?.available && "border-green-500 ring-green-500 focus-visible:ring-green-500",
                                    (name1Status?.available === false) && "border-red-500 ring-red-500 focus-visible:ring-red-500"
                                )}
                            />
                            <div className="absolute right-3 top-2.5">
                                {checking && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                                {!checking && !isTyping && name1Status?.available && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                                {!checking && !isTyping && name1Status?.available === false && <XCircle className="h-5 w-5 text-red-500" />}
                            </div>
                        </div>

                        {errors.name1 && <p className="text-red-500 text-sm">Valid name is required (min 3 chars)</p>}

                        {!checking && !isTyping && name1Status?.available === false && (
                            <p className="text-red-500 text-sm">{name1Status.reason}</p>
                        )}
                        {!checking && !isTyping && name1Status?.available && (
                            <p className="text-green-500 text-sm">Excellent! This name appears to be available.</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nameNepali">Proposed Name (in Nepali)</Label>
                        <Input
                            id="nameNepali"
                            placeholder="उदाहरण: एभरेष्ट टेक सोलुसन्स प्रा. लि."
                            {...register("nameNepali", { required: true })}
                        />
                        {errors.nameNepali && <p className="text-red-500 text-sm">Company name in Nepali is required</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name2">Proposed Name 2 (Alternative)</Label>
                        <Input id="name2" placeholder="e.g. Himalayan Digital Services Pvt. Ltd." {...register("name2")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name3">Proposed Name 3 (Alternative)</Label>
                        <Input id="name3" placeholder="e.g. Kathmandu Software Group Pvt. Ltd." {...register("name3")} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="companyType">Company Type</Label>
                        <Controller
                            control={control}
                            name="companyType"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select company type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="private-limited">Private Limited (Pvt. Ltd.)</SelectItem>
                                        <SelectItem value="public-limited">Public Limited</SelectItem>
                                        <SelectItem value="non-profit">Non-Profit (Munaafa Bitaran Nagarne)</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="businessObjectives">Business Objectives</Label>
                        <textarea
                            id="businessObjectives"
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Briefly describe what your company will do (e.g., Software development, IT consulting, E-commerce operations...)"
                            {...register("businessObjectives", { required: true })}
                        />
                        {errors.businessObjectives && <p className="text-red-500 text-sm">Business objectives are required</p>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={checking || (name1Status?.available === false)}>
                    Continue
                </Button>
            </div>
        </form>
    )
}
