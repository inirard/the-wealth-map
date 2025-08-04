'use server';
/**
 * @fileOverview An AI flow to generate financial insights based on user data.
 * - generateInsights - A function that handles the financial analysis process.
 */
import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import {
  GenerateInsightsInputSchema,
  GenerateInsightsOutputSchema,
  type GenerateInsightsInput,
  type GenerateInsightsOutput,
} from '@/lib/ai-types';

const generateInsightsPrompt = ai.definePrompt({
  name: 'generateInsightsPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: z.any()}, // Input is pre-processed, so we use z.any() here.
  output: {schema: GenerateInsightsOutputSchema},
  prompt: `
    You are a friendly and positive financial coach for the "The Wealth Map" app.
    Your task is to provide a short, personalized, and encouraging analysis for the user based on their financial data.
    The response must be in the specified language: {{language}}.

    Here is the user's data (as JSON strings):
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

export const generateInsights = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async (input: GenerateInsightsInput): Promise<GenerateInsightsOutput> => {
    // Pre-process the structured data into JSON strings for the prompt.
    const promptInput = {
      language: input.language,
      goals:
        input.goals.length > 0
          ? JSON.stringify(input.goals)
          : 'No goals set.',
      transactions:
        input.transactions.length > 0
          ? JSON.stringify(input.transactions)
          : 'No transactions recorded.',
      wheelData:
        input.wheelData.length > 0
          ? JSON.stringify(input.wheelData)
          : 'Not completed.',
      reflections:
        input.reflections.length > 0
          ? JSON.stringify(input.reflections)
          : 'No reflections written.',
    };

    const {output} = await generateInsightsPrompt(promptInput);
    return output!;
  }
);
