
"use client";

import { Tag } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Advertisement } from '@/lib/types';
import * as db from '@/lib/firestore';

export default function AdBanner() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [isClient, setIsClient] = useState(false);

    const loadAds = useCallback(async () => {
        try {
            const adsData = await db.ads.getAll();
            setAds(adsData);
        } catch (error) {
            console.error("Failed to load ads from Firestore", error);
        }
    }, []);
    
    useEffect(() => {
        setIsClient(true);
        loadAds();
    }, [loadAds]);


    if (!isClient) {
        return null;
    }

    const activeAds = ads.filter(ad => ad.status === 'Active' && ad.appliesTo !== 'hero');

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
