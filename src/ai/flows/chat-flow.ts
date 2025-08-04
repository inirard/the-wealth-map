
'use server';

/**
 * @fileOverview A chat flow for interacting with the AI financial coach.
 * - chatFlow - A function that handles the chat interaction.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import {
  ChatInputSchema,
  ChatOutputSchema,
  type ChatInput,
  type ChatOutput,
} from '@/lib/ai-types';


const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  model: googleAI.model('gemini-1.5-flash-latest'),
  input: {schema: z.any()}, // Input is pre-processed, so we use z.any() here.
  output: {schema: ChatOutputSchema},
  prompt: `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: {{language}}.

You have access to the user's financial data (as JSON strings) to provide personalized responses.
- User's financial goals: {{goals}}
- User's recent transactions: {{transactions}}
- User's Wealth Wheel assessment: {{wheelData}}
- User's personal reflections: {{reflections}}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History (a formatted string):
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
    // Pre-process the structured data into JSON strings for the prompt.
    const promptInput = {
      language: input.language,
      message: input.message,
      history:
        input.history
          .map(msg => `${msg.role === 'model' ? 'AI' : 'User'}: ${msg.content}`)
          .join('\n') || 'No history.',
      goals:
        input.goals.length > 0
          ? JSON.stringify(input.goals)
          : 'No goals set.',
      transactions:
        input.transactions.length > 0
          ? JSON.stringify(input.transactions)
          : 'No transactions recorded.',
      wheelData:
        input.wheelData.length > 0
          ? JSON.stringify(input.wheelData)
          : 'Not completed.',
      reflections:
        input.reflections.length > 0
          ? JSON.stringify(input.reflections)
          : 'No reflections written.',
    };

    const {output} = await chatPrompt(promptInput);
    return output!;
  }
);
