'use server';
/**
 * @fileOverview An AI flow to generate financial predictions based on user data.
 * - predictiveInsightsFlow - A function that handles the financial prediction process.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import {
  PredictiveInsightsOutputSchema,
  type PredictiveInsightsOutput,
  GoalSchema,
  TransactionSchema
} from '@/lib/ai-types';


const PredictiveInsightsFlowInputSchema = z.object({
    language: z.enum(['pt', 'en', 'es', 'fr']),
    goals: z.string(), // Expecting a JSON string now
    transactions: z.string(), // Expecting a JSON string now
    currentDate: z.string().describe('The current date in ISO format.'),
});

export const PredictiveInsightsInputSchema = z.object({
    language: z.enum(['pt', 'en', 'es', 'fr']),
    goals: z.array(GoalSchema),
    transactions: z.array(TransactionSchema),
    currentDate: z.string().describe('The current date in ISO format.'),
});
export type PredictiveInsightsInput = z.infer<typeof PredictiveInsightsInputSchema>;


const predictiveInsightsPrompt = ai.definePrompt({
  name: 'predictiveInsightsPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: PredictiveInsightsFlowInputSchema},
  output: {schema: PredictiveInsightsOutputSchema},
  prompt: `You are "The Wealth Map AI Forecaster", an analytical and insightful financial prediction engine.
Your response MUST be in the user's specified language: {{language}}.
The current date is {{currentDate}}.

Analyze the user's financial data, provided as JSON strings:
- Goals: {{goals}}
- Transactions: {{transactions}}

Based on the data, generate the following predictive insights:

1.  **futureBalancePrediction**: A realistic prediction of the user's net balance change over the next 30 days.
2.  **goalProjections**: For each goal, provide a projection on when they might achieve it based on their current savings rate.
3.  **spendingAnalysis**: Identify the top spending category and suggest one specific, actionable way to reduce it.
4.  **proactiveAlerts**: Generate one or two automated-style alerts, such as "High spending on 'Eating Out' detected this month" or "You are on track to meet your 'Vacation' goal."
5.  **whatIfScenario**: Create a simple, motivating 'what if' scenario, like "If you saved an extra €50 per month, you could reach your emergency fund goal 3 months sooner."

Your entire output must be a valid JSON object matching the output schema.
`,
});

// This flow is now internal and expects stringified data
const predictiveInsightsFlow = ai.defineFlow(
  {
    name: 'predictiveInsightsFlow',
    inputSchema: PredictiveInsightsFlowInputSchema,
    outputSchema: PredictiveInsightsOutputSchema,
  },
  async (input) => {
    const {output} = await predictiveInsightsPrompt(input);
    return output!;
  }
);


// This is the exported function that the API route will call.
// It handles the conversion from object arrays to JSON strings.
export async function predictiveInsights(
  input: PredictiveInsightsInput
): Promise<PredictiveInsightsOutput> {
   const flowInput = {
    ...input,
    goals: input.goals.length > 0 ? JSON.stringify(input.goals) : "No goals set.",
    transactions: input.transactions.length > 0 ? JSON.stringify(input.transactions) : "No transactions recorded.",
  };
  return await predictiveInsightsFlow(flowInput);
}
