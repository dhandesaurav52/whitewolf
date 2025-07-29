
"use client";

import { Tag } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Advertisement } from '@/lib/types';

// In a real app, you would fetch this from a database.
const initialAds: Advertisement[] = [
    { id: '1', text: '20% off all T-Shirts for a limited time!' },
    { id: '2', text: 'Free shipping on orders over ₹1000.' },
    { id: '3', text: 'New summer collection just dropped. Shop now!' },
];

export default function AdBanner() {
    const [ads, setAds] = useState<Advertisement[]>(initialAds);

    // In a real application, you would have a useEffect here to fetch ads
    // from your backend and update the state.
    // For this prototype, we'll stick with the initial static ads.

    if (ads.length === 0) {
        return null;
    }

    // Duplicate ads to create a seamless loop for the marquee
    const duplicatedAds = [...ads, ...ads];

    return (
        <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap">
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
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
