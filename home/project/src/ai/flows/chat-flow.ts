
'use server';

/**
 * @fileOverview A chat flow for interacting with the AI financial coach.
 * - chatPrompt - Configuration for the chat prompt.
 */

import {googleAI} from '@genkit-ai/googleai';
import type {PromptConfig} from 'genkit/ai';
import {
  ChatInputSchema,
  ChatOutputSchema,
  type ChatInput,
  type ChatOutput,
} from '@/lib/ai-types';
import {ai} from '@/ai/genkit';

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  model: googleAI('gemini-pro'),
  prompt: `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: {{{language}}}.

You have access to the user's financial data to provide personalized responses.
- User's financial goals: {{json goals}}
- User's recent transactions: {{json transactions}}
- User's Wealth Wheel assessment: {{json wheelData}}
- User's personal reflections: {{json reflections}}

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
