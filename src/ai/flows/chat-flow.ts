'use server';

/**
 * @fileOverview A chat flow for interacting with the AI financial coach.
 * - chatFlow - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';

import {
  ChatOutputSchema,
  GoalSchema,
  TransactionSchema,
  WealthWheelDataSchema,
  ReflectionSchema,
  ChatMessageSchema,
} from '@/lib/ai-types';

// The input schema now expects a simple string for the history.
export const ChatInputSchema = z.object({
  language: z.enum(['pt', 'en', 'es', 'fr']),
  history: z.array(ChatMessageSchema),
  message: z.string(),
  goals: z.array(GoalSchema),
  transactions: z.array(TransactionSchema),
  wheelData: z.array(WealthWheelDataSchema),
  reflections: z.array(ReflectionSchema),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;


const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: z.any()}, // Use a more flexible schema for the prompt itself
  output: {schema: ChatOutputSchema},
  prompt: `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: {{language}}.

You have access to the user's financial data to provide personalized responses.
- User's financial goals: {{#if goals.length}}{{json goals}}{{else}}No goals set.{{/if}}
- User's recent transactions: {{#if transactions.length}}{{json transactions}}{{else}}No transactions recorded.{{/if}}
- User's Wealth Wheel assessment: {{#if wheelData.length}}{{json wheelData}}{{else}}Not completed.{{/if}}
- User's personal reflections: {{#if reflections.length}}{{json reflections}}{{else}}No reflections written.{{/if}}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History:
{{history}}

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
     // Pre-format the history into a simple string to avoid complex logic in the AI prompt.
    const historyAsString = input.history
      .map(msg => `${msg.role === 'model' ? 'AI' : 'User'}: ${msg.content}`)
      .join('\n');

    const promptInput = {
      ...input,
      history: historyAsString,
    };

    const {output} = await chatPrompt(promptInput);
    return output!;
  }
);
