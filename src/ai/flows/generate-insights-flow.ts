
'use server';
/**
 * @fileOverview An AI flow to generate financial insights based on user data.
 *
 * - generateInsights - A function that handles the financial analysis process.
 */

import {ai} from '@/ai/genkit';
import { GenerateInsightsInputSchema, GenerateInsightsOutputSchema, type GenerateInsightsInput, type GenerateInsightsOutput } from '@/lib/ai-types';

export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return generateInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  input: {schema: GenerateInsightsInputSchema},
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `
    You are a friendly and positive financial coach for the "The Wealth Map" app.
    Your task is to provide a short, personalized, and encouraging analysis for the user based on their financial data.
    The response must be in the specified language: {{language}}.

    Here is the user's data:
    - Goals: {{goals}}
    - Transactions: {{transactions}}
    - Wealth Wheel Assessment: {{wheelData}}
    - Personal Reflections: {{reflections}}

    Based on this data, please generate a single paragraph of analysis that does the following:
    1.  Acknowledge a specific positive point from their reflections or a goal they are progressing on.
    2.  Gently point out a potential area for improvement, linking it to their transactions or their lowest-scoring Wealth Wheel category.
    3.  Suggest one small, concrete, and actionable step they could take next month.
    4.  End with a motivational and encouraging sentence.

    Keep the tone light, supportive, and non-judgmental. Do not sound like a robot. Write as a human coach would.
    The entire analysis should be a single paragraph.
  `,
});

// Function to extract retry delay from the error message
const getRetryDelay = (errorMessage: string): number | null => {
    const match = errorMessage.match(/"retryDelay":"(\d+(\.\d+)?)s"/);
    if (match && match[1]) {
        return Math.ceil(parseFloat(match[1])) * 1000; // Convert to ms and round up
    }
    return null;
};


const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async (input) => {
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (e: any) {
         if (i === maxRetries - 1) { // If it's the last retry, throw the error
          console.error(`Final attempt failed: ${e.message}`);
          throw e;
        }

        const errorMessage = e.message || '';
        let delay: number;

        if (e.status === 429) {
            const retryDelay = getRetryDelay(errorMessage);
            // Use suggested delay if available, otherwise use exponential backoff
            delay = retryDelay !== null ? retryDelay : 1000 * (2 ** i);
            console.warn(`Attempt ${i + 1} failed with 429 status. Retrying in ${delay}ms...`);
        } else {
            // Use exponential backoff for other errors
            delay = 1000 * (2 ** i);
            console.warn(`Attempt ${i + 1} failed, retrying in ${delay}ms... Error: ${errorMessage}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    // This part should not be reachable due to the error being thrown in the loop,
    // but it satisfies TypeScript's need for a return path.
    throw new Error("Failed to generate insights after multiple retries.");
  }
);
