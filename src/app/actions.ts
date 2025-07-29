"use server";

import {
  generateStyleRecommendation,
  StyleRecommendationInput,
} from "@/ai/flows/generate-style-recommendation";
import { improveRecommendationBasedOnFeedback } from "@/ai/flows/improve-recommendation-based-on-feedback";
import { z } from "zod";

const recommendationSchema = z.object({
  occasion: z.string(),
  weather: z.string(),
  style: z.string(),
});

export async function generateRecommendationAction(values: z.infer<typeof recommendationSchema>) {
  try {
    const validatedData = recommendationSchema.parse(values);
    const result = await generateStyleRecommendation(validatedData);
    if (!result || !result.recommendation) {
        throw new Error('AI failed to generate a recommendation.');
    }
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}

const feedbackSchema = z.object({
    currentRecommendation: z.string(),
    feedback: z.string(),
    userPreferences: z.string(),
});

export async function improveRecommendationAction(values: z.infer<typeof feedbackSchema>) {
    try {
        const validatedData = feedbackSchema.parse(values);
        // This is a mock implementation detail, as we don't have a product catalog.
        const brandStyles = "White Wolf offers a range of modern and classic pieces including cotton shirts, denim jeans, leather jackets, and wool sweaters.";
        const result = await improveRecommendationBasedOnFeedback({...validatedData, brandStyles});
        if (!result || !result.improvedRecommendation) {
            throw new Error('AI failed to improve the recommendation.');
        }
        return { success: true, data: result.improvedRecommendation };
    } catch (error) {
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: errorMessage };
    }
}
