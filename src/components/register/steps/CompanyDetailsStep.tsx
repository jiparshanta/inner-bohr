"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Select } from "@/components/ui/select" 


interface CompanyDetailsProps {
    onNext: (data: any) => void;
    onBack: () => void;
    defaultValues: any;
}

export function CompanyDetailsStep({ onNext, onBack, defaultValues }: CompanyDetailsProps) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

    const onSubmit = (data: any) => {
        onNext(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Company Details</h2>
                <p className="text-sm text-muted-foreground">Tell us about your company structure and location.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                    <Label htmlFor="address">Registered Address</Label>
                    <Input id="address" placeholder="e.g. Ward No. 4, Kathmandu" {...register("address", { required: true })} />
                    {errors.address && <span className="text-red-500 text-sm">Required</span>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="capital">Authorized Capital (NPR)</Label>
                    <Input id="capital" type="number" placeholder="e.g. 100000" {...register("capital", { required: true })} />
                    {errors.capital && <span className="text-red-500 text-sm">Required</span>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="objectives">Main Objectives</Label>
                    <Input id="objectives" placeholder="e.g. Software Development, IT Consulting" {...register("objectives", { required: true })} />
                    <p className="text-xs text-muted-foreground">Separate multiple objectives with commas.</p>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button type="submit">Next Step</Button>
            </div>
        </form>
    )
}
