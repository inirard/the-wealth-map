
'use server';
/**
 * @fileOverview An AI flow to generate financial insights based on user data.
 * This file exports the prompt configuration to be used by the API route.
 */
import { googleAI } from '@genkit-ai/googleai';
import { GenerateInsightsInputSchema, GenerateInsightsOutputSchema, type GenerateInsightsInput, type GenerateInsightsOutput } from '@/lib/ai-types';
import {ai} from '@/ai/genkit';

export const generateInsightsPrompt = ai.definePrompt({
    name: 'generateInsightsPrompt',
    input: {schema: GenerateInsightsInputSchema},
    output: {schema: GenerateInsightsOutputSchema},
    model: googleAI('gemini-1.5-flash-latest'),
    prompt: `
        You are a friendly and positive financial coach for the "The Wealth Map" app.
        Your task is to provide a short, personalized, and encouraging analysis for the user based on their financial data.
        The response must be in the specified language: {{{language}}}.

        Here is the user's data:
        - Goals: {{{goals}}}
        - Transactions: {{{transactions}}}
        - Wealth Wheel Assessment: {{{wheelData}}}
        - Personal Reflections: {{{reflections}}}

        Based on this data, please generate a single paragraph of analysis that does the following:
        1.  Acknowledge a specific positive point from their reflections or a goal they are progressing on.
        2.  Gently point out a potential area for improvement, linking it to their transactions or their lowest-scoring Wealth Wheel category.
        3.  Suggest one small, concrete, and actionable step they could take next month.
        4.  End with a motivational and encouraging sentence.

        Keep the tone light, supportive, and non-judgmental. Do not sound like a robot. Write as a human coach would.
        The entire analysis should be a single paragraph.
    `,
});

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  const { output } = await generateInsightsPrompt(input);
  return output!;
}
