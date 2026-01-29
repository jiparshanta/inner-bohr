import { RegisterWizard } from "@/components/register/RegisterWizard";

export default function RegisterPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Register Your Company</h1>
                <p className="text-muted-foreground mt-2">Follow the steps to legally register your business in Nepal.</p>
            </div>
            <RegisterWizard />
        </div>
    );
}
