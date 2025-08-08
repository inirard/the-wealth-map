'use server';
/**
 * @fileOverview An AI flow to generate financial predictions based on user data.
 * - predictiveInsightsFlow - A function that handles the financial prediction process.
 */

import {ai} from '@/ai/genkit';
import {
  PredictiveInsightsInputSchema,
  PredictiveInsightsOutputSchema,
  type PredictiveInsightsInput,
  type PredictiveInsightsOutput,
} from '@/lib/ai-types';

export const predictiveInsights = ai.defineFlow(
  {
    name: 'predictiveInsightsFlow',
    inputSchema: PredictiveInsightsInputSchema,
    outputSchema: PredictiveInsightsOutputSchema,
  },
  async (input: PredictiveInsightsInput): Promise<PredictiveInsightsOutput> => {
    const prompt = `You are "The Wealth Map AI Forecaster", an analytical and insightful financial prediction engine.
Your response MUST be in the user's specified language: ${input.language}.
The current date is ${input.currentDate}.

Analyze the user's financial data, provided as JSON strings:
- Goals: ${input.goals}
- Transactions: ${input.transactions}

Based on the data, generate the following predictive insights:

1.  **futureBalancePrediction**: A realistic prediction of the user's net balance change over the next 30 days.
2.  **goalProjections**: For each goal, provide a projection on when they might achieve it based on their current savings rate.
3.  **spendingAnalysis**: Identify the top spending category and suggest one specific, actionable way to reduce it.
4.  **proactiveAlerts**: Generate one or two automated-style alerts, such as "High spending on 'Eating Out' detected this month" or "You are on track to meet your 'Vacation' goal."
5.  **whatIfScenario**: Create a simple, motivating 'what if' scenario, like "If you saved an extra €50 per month, you could reach your emergency fund goal 3 months sooner."

Your entire output must be a valid JSON object matching the output schema.
`;
    
    const {output} = await ai.generate({
      model: 'googleai/gemini-1.5-flash-preview',
      prompt,
      output: {
        schema: PredictiveInsightsOutputSchema
      }
    });

    return output!;
  }
);
