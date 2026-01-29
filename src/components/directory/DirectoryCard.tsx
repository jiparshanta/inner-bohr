
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Mountain, Laptop, Sprout, ShoppingBag, Gift, GraduationCap } from 'lucide-react';
import { BusinessGuide } from '@/lib/business-data';

// Helper to render icons dynamically
const IconMap: { [key: string]: any } = {
    Mountain,
    Laptop,
    Sprout,
    ShoppingBag,
    Gift,
    GraduationCap
};

interface DirectoryCardProps {
    guide: BusinessGuide;
}

export function DirectoryCard({ guide }: DirectoryCardProps) {
    const Icon = IconMap[guide.icon] || Laptop;

    return (
        <Card className="hover:shadow-lg transition-shadow duration-300 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-xl font-bold">{guide.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                        {guide.summary}
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="text-sm text-muted-foreground bg-zinc-50 dark:bg-zinc-900 p-3 rounded-md">
                        <span className="font-semibold block mb-1">Estimated Capital:</span>
                        {guide.estimatedCapital}
                    </div>

                    <Link
                        href={`/directory/${guide.slug}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                        Read Full Guide
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
