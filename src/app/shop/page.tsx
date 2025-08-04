
import { Suspense } from 'react';
import ShopPageClient from '@/components/ShopPageClient';
import { Skeleton } from '@/components/ui/skeleton';

function ShopPageSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopPageSkeleton />}>
            <ShopPageClient />
        </Suspense>
    );
}
