'use server';
/**
 * @fileOverview AI-powered style recommendation flow for generating personalized clothing suggestions.
 *
 * - generateStyleRecommendation - A function that generates style recommendations based on user preferences.
 * - StyleRecommendationInput - The input type for the generateStyleRecommendation function.
 * - StyleRecommendationOutput - The return type for the generateStyleRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleRecommendationInputSchema = z.object({
  occasion: z.string().describe('The occasion for which the outfit is needed (e.g., casual, business, formal).'),
  weather: z.string().describe('The weather conditions for which the outfit is needed (e.g., sunny, rainy, cold).'),
  style: z.string().describe('The preferred style of the user (e.g., modern, classic, edgy).'),
});
export type StyleRecommendationInput = z.infer<typeof StyleRecommendationInputSchema>;

const StyleRecommendationOutputSchema = z.object({
  recommendation: z.string().describe('The AI-generated style recommendation.'),
  garments: z.array(
    z.object({
      name: z.string().describe('The name of the garment.'),
      description: z.string().describe('A description of the garment.'),
      link: z.string().url().describe('A link to purchase the garment from White Wolf online store.'),
    })
  ).describe('An array of recommended garments with details and purchase links.'),
});
export type StyleRecommendationOutput = z.infer<typeof StyleRecommendationOutputSchema>;

export async function generateStyleRecommendation(input: StyleRecommendationInput): Promise<StyleRecommendationOutput> {
  return generateStyleRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleRecommendationPrompt',
  input: {schema: StyleRecommendationInputSchema},
  output: {schema: StyleRecommendationOutputSchema},
  prompt: `You are a personal style advisor for White Wolf, a mens clothing brand.

  Based on the occasion, weather, and style preferences provided by the user, generate a personalized clothing style recommendation.
  The recommendation should consist of an overall description of the outfit, as well as a list of specific garments that can be purchased from White Wolf.

  Make sure to include a link to purchase each garment from the White Wolf online store.

  Occasion: {{{occasion}}}
  Weather: {{{weather}}}
  Style: {{{style}}}
  `,
});

const generateStyleRecommendationFlow = ai.defineFlow(
  {
    name: 'generateStyleRecommendationFlow',
    inputSchema: StyleRecommendationInputSchema,
    outputSchema: StyleRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
