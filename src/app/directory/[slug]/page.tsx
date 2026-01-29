
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUSINESS_TYPES } from '@/lib/business-data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, AlertTriangle, FileText, Info } from 'lucide-react';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function BusinessDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const business = BUSINESS_TYPES.find((b) => b.slug === slug);

    if (!business) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="mb-8">
                <Link
                    href="/directory"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Directory
                </Link>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {/* We could use the icon mapping here again if needed, or just a generic one for header */}
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{business.title}</h1>
                </div>
                <p className="text-xl text-muted-foreground">{business.summary}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 space-y-8">
                    {/* Legal Requirements */}
                    <section className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Legal & Registration
                        </h2>
                        <ul className="space-y-3">
                            {business.legalRequirements.map((req, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-zinc-700 dark:text-zinc-300">{req}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                            <Button asChild className="w-full sm:w-auto">
                                <Link href="/register">Start Registration Now</Link>
                            </Button>
                        </div>
                    </section>

                    {/* Operations */}
                    <section className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-purple-500" />
                            Key Operational Requirements
                        </h2>
                        <ul className="space-y-3">
                            {business.operations.map((op, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0" />
                                    <span className="text-zinc-700 dark:text-zinc-300">{op}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <div className="space-y-6">
                    {/* Sidebar: Capital */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Estimated Capital</h3>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{business.estimatedCapital}</p>
                    </div>

                    {/* Sidebar: Nepal Specifics */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-6 border border-amber-200 dark:border-amber-900/30">
                        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-400 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Nepal Context
                        </h3>
                        <ul className="space-y-3">
                            {business.nepalSpecifics.map((spec, i) => (
                                <li key={i} className="text-sm text-amber-900 dark:text-amber-200/80 leading-relaxed">
                                    • {spec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
