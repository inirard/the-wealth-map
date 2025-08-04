'use server';
/**
 * @fileOverview An AI flow to generate financial predictions based on user data.
 * - predictiveInsights - A function that handles the financial prediction process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {
  PredictiveInsightsOutputSchema,
} from '@/lib/ai-types';
import {z} from 'genkit';


export const PredictiveInsightsInputSchema = z.object({
    language: z.enum(['pt', 'en', 'es', 'fr']),
    goals: z.string().describe("A JSON string of the user's goals."),
    transactions: z.string().describe("A JSON string of the user's transactions."),
    currentDate: z.string().describe('The current date in ISO format.'),
});
export type PredictiveInsightsInput = z.infer<typeof PredictiveInsightsInputSchema>;


const predictiveInsightsPrompt = ai.definePrompt({
  name: 'predictiveInsightsPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: PredictiveInsightsInputSchema},
  output: {schema: PredictiveInsightsOutputSchema},
  prompt: `You are "The Wealth Map AI Forecaster", an analytical and insightful financial prediction engine.
Your response MUST be in the user's specified language: {{language}}.
The current date is {{currentDate}}.

Analyze the user's financial data:
- Goals: {{{goals}}}
- Transactions: {{{transactions}}}

Based on the data, generate the following predictive insights:

1.  **futureBalancePrediction**: A realistic prediction of the user's net balance change over the next 30 days.
2.  **goalProjections**: For each goal, provide a projection on when they might achieve it based on their current savings rate. If there are no goals, this array should be empty.
3.  **spendingAnalysis**: Identify the top spending category and suggest one specific, actionable way to reduce it. If there are no transactions, state that you cannot analyze spending without data.
4.  **proactiveAlerts**: Generate one or two automated-style alerts, such as "High spending on 'Eating Out' detected this month" or "You are on track to meet your 'Vacation' goal." If there is not enough data, this array can be empty.
5.  **whatIfScenario**: Create a simple, motivating 'what if' scenario, like "If you saved an extra €50 per month, you could reach your emergency fund goal 3 months sooner." If there is not enough data, provide a generic motivational scenario.

Your entire output must be a valid JSON object matching the output schema.
`,
});

export const predictiveInsights = ai.defineFlow({
    name: 'predictiveInsightsFlow',
    inputSchema: PredictiveInsightsInputSchema,
    outputSchema: PredictiveInsightsOutputSchema,
  },
  async (input: PredictiveInsightsInput): Promise<PredictiveInsightsOutput> => {
    const {output} = await predictiveInsightsPrompt(input);
    return output!;
  }
);