"use client"

import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileCheck, X } from "lucide-react"
import { RegistrationFormData } from "@/types/registration"
import { useState } from "react"

interface DocumentUploadStepProps {
    onNext: (data: Partial<RegistrationFormData>) => void;
    onBack: () => void;
    formData: Partial<RegistrationFormData>;
}

export function DocumentUploadStep({ onNext, onBack, formData }: DocumentUploadStepProps) {
    // We are simulating file upload state here as React Hook Form with File inputs can be tricky in specialized wizards
    // In a real app, we'd use Dropzone or similar.
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        citizenshipFront: formData.uploadedFiles?.citizenshipFront || null,
        citizenshipBack: formData.uploadedFiles?.citizenshipBack || null,
        photo: formData.uploadedFiles?.photo || null,
        signature: formData.uploadedFiles?.signature || null,
    })

    const handleFileChange = (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [key]: e.target.files![0] }))
        }
    }

    const removeFile = (key: string) => {
        setFiles(prev => ({ ...prev, [key]: null }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation: Ensure all files are present (optional for demo, but good practice)
        // For now, we allow proceeding even if empty for ease of testing
        onNext({ uploadedFiles: files })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-xl font-semibold">Upload Required Documents</h2>
                <p className="text-sm text-muted-foreground">
                    Please upload clear scans or photos of the following documents.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                    title="Citizenship (Front)"
                    fileKey="citizenshipFront"
                    file={files.citizenshipFront}
                    onChange={handleFileChange}
                    onRemove={removeFile}
                    accept="image/*,.pdf"
                />
                <DocumentUploadCard
                    title="Citizenship (Back)"
                    fileKey="citizenshipBack"
                    file={files.citizenshipBack}
                    onChange={handleFileChange}
                    onRemove={removeFile}
                    accept="image/*,.pdf"
                />
                <DocumentUploadCard
                    title="Passport Size Photo"
                    fileKey="photo"
                    file={files.photo}
                    onChange={handleFileChange}
                    onRemove={removeFile}
                    accept="image/*"
                />
                <DocumentUploadCard
                    title="Scanned Signature"
                    fileKey="signature"
                    file={files.signature}
                    onChange={handleFileChange}
                    onRemove={removeFile}
                    accept="image/*"
                />
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit">
                    Continue to Document Generation
                </Button>
            </div>
        </form>
    )
}

interface DocumentUploadCardProps {
    title: string;
    fileKey: string;
    file: File | null;
    onChange: (key: string, e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: (key: string) => void;
    accept: string;
}

function DocumentUploadCard({ title, fileKey, file, onChange, onRemove, accept }: DocumentUploadCardProps) {
    return (
        <Card className="border-dashed border-2 hover:bg-muted/10 transition-colors">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                    {file ? <FileCheck className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
                </div>
                <div className="space-y-1">
                    <h4 className="font-medium text-sm">{title}</h4>
                    {file ? (
                        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground bg-slate-100 py-1 px-2 rounded-md">
                            <span className="truncate max-w-[150px]">{file.name}</span>
                            <button type="button" onClick={() => onRemove(fileKey)} className="text-red-500 hover:text-red-600">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground">Drag & drop or Click to upload</p>
                    )}
                </div>

                {!file && (
                    <div className="relative">
                        <Input
                            type="file"
                            accept={accept}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => onChange(fileKey, e)}
                        />
                        <Button type="button" variant="secondary" size="sm" className="pointer-events-none">
                            Select File
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
