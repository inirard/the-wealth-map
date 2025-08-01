
'use server';
/**
 * @fileOverview A flow for an interactive financial chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 */
import {googleAI} from '@genkit-ai/googleai';
import {ai} from '@/ai/genkit';
import { ChatInputSchema, ChatOutputSchema, type ChatInput, type ChatOutput } from '@/lib/ai-types';

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
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

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
