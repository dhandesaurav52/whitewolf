import type { StyleRecommendationOutput } from '@/ai/flows/generate-style-recommendation';

export type Garment = StyleRecommendationOutput['garments'][0];

export type Recommendation = StyleRecommendationOutput & {
    id: string;
    preferences: {
        occasion: string;
        weather: string;
        style: string;
    }
};
