
'use server';
/**
 * @fileOverview A flow for an interactive financial chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/lib/ai-types';

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `
    You are a friendly, helpful, and slightly informal financial coach for "The Wealth Map" app.
    Your goal is to answer the user's questions based on their financial data, providing insights and encouragement.
    The response must be in the specified language: {{language}}.

    You have access to the user's financial data:
    - Financial Goals: {{#if goals}}{{goals}}{{else}}No goals set.{{/if}}
    - Recent Transactions: {{#if transactions}}{{transactions}}{{else}}No transactions recorded.{{/if}}
    - Wealth Wheel Assessment: {{#if wheelData}}{{wheelData}}{{else}}Not completed.{{/if}}
    - Personal Reflections: {{#if reflections}}{{reflections}}{{else}}No reflections written.{{/if}}

    You also have the chat history with the user. Use it to maintain context.
    - Chat History:
    {{#each history}}
      - {{role}}: {{content}}
    {{/each}}
    
    This is the user's new message:
    - User Message: {{message}}

    Based on all this information, provide a concise, helpful, and encouraging answer to the user's message. 
    If you don't have enough information to answer, gently ask the user to provide more details or fill out the relevant section of the app.
    For example, if they ask about savings but have no transactions, suggest they start tracking their expenses.
    Keep your answers short and to the point.
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

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
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
                delay = retryDelay !== null ? retryDelay : 1000 * (2 ** i);
                console.warn(`Attempt ${i + 1} failed with ${e.status} status. Retrying in ${delay}ms...`);
            } else {
                delay = 1000 * (2 ** i);
                console.warn(`Attempt ${i + 1} failed, retrying in ${delay}ms... Error: ${errorMessage}`);
            }
            
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error("Failed to get chat response after multiple retries.");
  }
);
