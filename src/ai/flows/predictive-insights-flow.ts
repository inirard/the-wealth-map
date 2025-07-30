
'use server';
/**
 * @fileOverview An AI flow to generate predictive financial scenarios and advice.
 *
 * - predictFinancialFuture - A function that handles the financial prediction process.
 */

import {ai} from '@/ai/genkit';
import { PredictiveInsightsInputSchema, PredictiveInsightsOutputSchema, type PredictiveInsightsInput, type PredictiveInsightsOutput } from '@/lib/ai-types';

export async function predictFinancialFuture(input: PredictiveInsightsInput): Promise<PredictiveInsightsOutput> {
  return predictiveInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveInsightsPrompt',
  input: {schema: PredictiveInsightsInputSchema},
  output: {schema: PredictiveInsightsOutputSchema},
  prompt: `
    You are a proactive and insightful financial analyst for "The Wealth Map" app. 
    Your role is to analyze a user's financial data to provide future predictions and actionable advice.
    The response must be in the specified language: {{language}}.
    The current date is {{currentDate}}.

    User's Financial Data:
    - Goals: {{#if goals.length}}{{json goals}}{{else}}No goals set.{{/if}}
    - Transactions (last 90 days): {{#if transactions.length}}{{json transactions}}{{else}}No transactions recorded.{{/if}}

    Based on this data, perform the following analysis and provide clear, concise, and helpful insights for each point.

    1.  **Future Balance Prediction**: Analyze the income and expenses from the last 30 days. Based on the net balance, predict the user's likely account balance at the end of the current month. If there isn't enough data, state that.
        Example: "If you maintain your current spending habits, you're on track to have approximately €350 available at the end of the month."

    2.  **Goal Projections**: For each of the user's goals, calculate a realistic projection for when they might achieve it based on their recent savings rate (average monthly positive balance). If their balance is negative, state that they are not on track.
        Example for a goal: { goalName: "Trip to Japan", projection: "At your current savings rate, you could reach this goal in approximately 8 months." }

    3.  **Spending Pattern Analysis**: Identify the top 2-3 spending categories or recurring expenses. Point out one specific area where they could potentially save money without making drastic changes.
        Example: "A significant portion of your spending is on dining out. Reducing this by one meal per week could save you over €80 per month."

    4.  **Proactive Alerts**: Based on the last 30-60 days of data, create one important alert. This could be about an increase in a spending category, a subscription they might have forgotten, or a warning if their expenses are higher than their income.
        Example: "Alert: Your spending on online subscriptions has increased by 20% this month."

    5.  **'What If' Scenario**: Create one interesting 'what if' scenario to motivate the user. It should be based on a small, achievable change.
        Example: "What if you redirected the money from your daily coffee to your 'Emergency Fund' goal? You could boost that fund by an extra €60 each month!"
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


const predictiveInsightsFlow = ai.defineFlow(
  {
    name: 'predictiveInsightsFlow',
    inputSchema: PredictiveInsightsInputSchema,
    outputSchema: PredictiveInsightsOutputSchema,
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

        if (e.status === 429 || e.status === 503) {
            const retryDelay = getRetryDelay(errorMessage);
            // Use suggested delay if available, otherwise use exponential backoff
            delay = retryDelay !== null ? retryDelay : 1000 * (2 ** i);
            console.warn(`Attempt ${i + 1} failed with ${e.status} status. Retrying in ${delay}ms...`);
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
    throw new Error("Failed to generate predictive insights after multiple retries.");
  }
);
