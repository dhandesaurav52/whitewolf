'use server';
/**
 * @fileOverview A flow for improving outfit recommendations based on user feedback.
 *
 * - improveRecommendationBasedOnFeedback - A function that handles the process of improving recommendations based on feedback.
 * - ImproveRecommendationBasedOnFeedbackInput - The input type for the improveRecommendationBasedOnFeedback function.
 * - ImproveRecommendationBasedOnFeedbackOutput - The return type for the improveRecommendationBasedOnFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveRecommendationBasedOnFeedbackInputSchema = z.object({
  currentRecommendation: z.string().describe('The current outfit recommendation.'),
  feedback: z.string().describe('The user feedback on the current recommendation.'),
  userPreferences: z.string().describe('The user preferences.'),
  brandStyles: z.string().describe('Available brand styles and garments.'),
});
export type ImproveRecommendationBasedOnFeedbackInput = z.infer<typeof ImproveRecommendationBasedOnFeedbackInputSchema>;

const ImproveRecommendationBasedOnFeedbackOutputSchema = z.object({
  improvedRecommendation: z.string().describe('The improved outfit recommendation based on the feedback.'),
});
export type ImproveRecommendationBasedOnFeedbackOutput = z.infer<typeof ImproveRecommendationBasedOnFeedbackOutputSchema>;

export async function improveRecommendationBasedOnFeedback(input: ImproveRecommendationBasedOnFeedbackInput): Promise<ImproveRecommendationBasedOnFeedbackOutput> {
  return improveRecommendationBasedOnFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveRecommendationBasedOnFeedbackPrompt',
  input: {schema: ImproveRecommendationBasedOnFeedbackInputSchema},
  output: {schema: ImproveRecommendationBasedOnFeedbackOutputSchema},
  prompt: `You are a personal style advisor for White Wolf, a men's clothing brand.

  Current Outfit Recommendation: {{{currentRecommendation}}}
  User Feedback: {{{feedback}}}
  User Preferences: {{{userPreferences}}}
  Brand Styles and Garments: {{{brandStyles}}}

  Based on the user's feedback and preferences, and the available brand styles and garments, provide an improved outfit recommendation that is tailored to the user's taste.
  Ensure the improved recommendation aligns with the White Wolf brand.
  `, // Ensure the improved recommendation aligns with the White Wolf brand.
});

const improveRecommendationBasedOnFeedbackFlow = ai.defineFlow(
  {
    name: 'improveRecommendationBasedOnFeedbackFlow',
    inputSchema: ImproveRecommendationBasedOnFeedbackInputSchema,
    outputSchema: ImproveRecommendationBasedOnFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
