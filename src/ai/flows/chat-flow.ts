
'use server';

/**
 * @fileOverview A chat flow for interacting with the AI financial coach.
 * This file exports the prompt configuration to be used by the API route.
 */

import {googleAI} from '@genkit-ai/googleai';
import {
  ChatInputSchema,
  ChatOutputSchema,
  type ChatInput,
  type ChatOutput,
} from '@/lib/ai-types';
import {ai} from '@/ai/genkit';

export const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  model: googleAI('gemini-1.5-flash-latest'),
  prompt: `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: {{{language}}}.

You have access to the user's financial data to provide personalized responses.
- User's financial goals: {{{goals}}}
- User's recent transactions: {{{transactions}}}
- User's Wealth Wheel assessment: {{{wheelData}}}
- User's personal reflections: {{{reflections}}}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History:
{{#each history}}
  {{#if (eq role "model")}}
    AI: {{{content}}}
  {{else}}
    User: {{{content}}}
  {{/if}}
{{/each}}

User's new message:
{{{message}}}
`,
});

export async function chatFlow(input: ChatInput): Promise<ChatOutput> {
  const {output} = await chatPrompt(input);
  return output!;
}
