
import { DirectoryCard } from '@/components/directory/DirectoryCard';
import { BUSINESS_TYPES } from '@/lib/business-data';

export default function DirectoryPage() {
    return (
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto mb-10 text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                    Business Directory
                </h1>
                <p className="mt-4 text-xl text-zinc-500 dark:text-zinc-400">
                    Explore curated guides on starting various businesses in Nepal. From legal requirements to market insights.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {BUSINESS_TYPES.map((business) => (
                    <DirectoryCard key={business.id} guide={business} />
                ))}
            </div>
        </div>
    );
}
