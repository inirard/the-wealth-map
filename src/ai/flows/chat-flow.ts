'use server';

/**
 * @fileOverview A chat flow for interacting with the AI financial coach.
 * - chatFlow - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

import {
  ChatOutputSchema
} from '@/lib/ai-types';

export const ChatInputSchema = z.object({
  language: z.enum(['pt', 'en', 'es', 'fr']),
  history: z.string().describe("The conversation history as a string."),
  message: z.string(),
  goals: z.string().describe("A JSON string of the user's goals."),
  transactions: z.string().describe("A JSON string of the user's transactions."),
  wheelData: z.string().describe("A JSON string of the user's Wealth Wheel assessment."),
  reflections: z.string().describe("A JSON string of the user's personal reflections."),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: z.any()},
  output: {schema: ChatOutputSchema},
  prompt: `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: {{language}}.

You have access to the user's financial data to provide personalized responses.
- User's financial goals: {{{goals}}}
- User's recent transactions: {{{transactions}}}
- User's Wealth Wheel assessment: {{{wheelData}}}
- User's personal reflections: {{{reflections}}}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History:
{{{history}}}

User's new message:
{{{message}}}
`,
});

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input: ChatInput): Promise<ChatOutput> => {
    const {output} = await chatPrompt(input);
    return output!;
  }
);