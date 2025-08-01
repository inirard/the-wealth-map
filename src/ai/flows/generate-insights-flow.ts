
'use server';
/**
 * @fileOverview An AI flow to generate financial insights based on user data.
 *
 * - generateInsights - A function that handles the financial analysis process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import { GenerateInsightsInputSchema, GenerateInsightsOutputSchema, type GenerateInsightsInput, type GenerateInsightsOutput } from '@/lib/ai-types';

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `
    You are a friendly and positive financial coach for the "The Wealth Map" app.
    Your task is to provide a short, personalized, and encouraging analysis for the user based on their financial data.
    The response must be in the specified language: {{language}}.

    Here is the user's data:
    - Goals: {{#if goals.length}}{{json goals}}{{else}}No goals set.{{/if}}
    - Transactions: {{#if transactions.length}}{{json transactions}}{{else}}No transactions recorded.{{/if}}
    - Wealth Wheel Assessment: {{#if wheelData.length}}{{json wheelData}}{{else}}Not completed.{{/if}}
    - Personal Reflections: {{#if reflections.length}}{{json reflections}}{{else}}No reflections written.{{/if}}

    Based on this data, please generate a single paragraph of analysis that does the following:
    1.  Acknowledge a specific positive point from their reflections or a goal they are progressing on.
    2.  Gently point out a potential area for improvement, linking it to their transactions or their lowest-scoring Wealth Wheel category.
    3.  Suggest one small, concrete, and actionable step they could take next month.
    4.  End with a motivational and encouraging sentence.

    Keep the tone light, supportive, and non-judgmental. Do not sound like a robot. Write as a human coach would.
    The entire analysis should be a single paragraph.
  `,
});

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
