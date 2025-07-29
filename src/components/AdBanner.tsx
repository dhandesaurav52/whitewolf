
"use client";

import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Advertisement } from '@/lib/types';

const ADS_STORAGE_KEY = 'advertisements';

const initialAds: Advertisement[] = [
    { id: '1', text: '20% off all T-Shirts for a limited time!', discountType: 'percentage', discountValue: 20, appliesTo: 'categories', selectedCategories: ['t-shirts'], status: 'Active' },
    { id: '2', text: 'Free shipping on orders over ₹1000.', discountType: 'fixed', discountValue: 0, appliesTo: 'products', selectedCategories: [], status: 'Active' },
];

export default function AdBanner() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
            if (storedAds) {
                setAds(JSON.parse(storedAds));
            } else {
                setAds(initialAds);
            }
        } catch (error) {
            console.error("Failed to load ads from localStorage", error);
            setAds(initialAds);
        }

        const handleStorageChange = () => {
             try {
                const storedAds = localStorage.getItem(ADS_STORAGE_KEY);
                if (storedAds) {
                    setAds(JSON.parse(storedAds));
                }
            } catch (error) {
                console.error("Failed to reload ads from localStorage", error);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, []);

    if (!isClient) {
        return null;
    }

    const activeAds = ads.filter(ad => ad.status === 'Active');

    if (activeAds.length === 0) {
        return null;
    }

    const duplicatedAds = activeAds.length > 1 ? [...activeAds, ...activeAds] : activeAds;

    return (
        <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap">
            <div className={duplicatedAds.length > 1 ? "flex animate-marquee hover:[animation-play-state:paused]" : "flex justify-center"}>
                {duplicatedAds.map((ad, index) => (
                    <div key={`${ad.id}-${index}`} className="flex items-center flex-shrink-0 px-6 py-2">
                        <Tag className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">{ad.text}</span>
                        {index < duplicatedAds.length - 1 && <div className="w-px h-4 bg-primary-foreground/30 mx-6"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
