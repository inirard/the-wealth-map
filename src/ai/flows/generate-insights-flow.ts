
'use server';
/**
 * @fileOverview An AI flow to generate financial insights based on user data.
 * - generateInsightsFlow - A function that handles the financial analysis process.
 */
import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { GenerateInsightsInputSchema, GenerateInsightsOutputSchema, type GenerateInsightsInput, type GenerateInsightsOutput } from '@/lib/ai-types';

const generateInsightsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFlow',
    inputSchema: GenerateInsightsInputSchema,
    outputSchema: GenerateInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      model: googleAI('gemini-pro'),
      prompt: `
        You are a friendly and positive financial coach for the "The Wealth Map" app.
        Your task is to provide a short, personalized, and encouraging analysis for the user based on their financial data.
        The response must be in the specified language: ${input.language}.

        Here is the user's data:
        - Goals: ${input.goals}
        - Transactions: ${input.transactions}
        - Wealth Wheel Assessment: ${input.wheelData}
        - Personal Reflections: ${input.reflections}

        Based on this data, please generate a single paragraph of analysis that does the following:
        1.  Acknowledge a specific positive point from their reflections or a goal they are progressing on.
        2.  Gently point out a potential area for improvement, linking it to their transactions or their lowest-scoring Wealth Wheel category.
        3.  Suggest one small, concrete, and actionable step they could take next month.
        4.  End with a motivational and encouraging sentence.

        Keep the tone light, supportive, and non-judgmental. Do not sound like a robot. Write as a human coach would.
        The entire analysis should be a single paragraph.
      `,
      output: { schema: GenerateInsightsOutputSchema },
    });
    return output!;
  }
);


export async function generateInsights(input: GenerateInsightsInput): Promise<GenerateInsightsOutput> {
  return await generateInsightsFlow(input);
}
