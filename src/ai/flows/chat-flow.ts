'use server';

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {
  ChatInputSchema,
  ChatOutputSchema,
  type ChatInput,
  type ChatOutput,
} from '@/lib/ai-types';

export const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input: ChatInput): Promise<ChatOutput> => {
    const prompt = `
You are "The Wealth Map AI Coach", a friendly, helpful financial assistant.

Your answers MUST be in the user's specified language: ${input.language}.

You have access to the user's financial data (as JSON strings) to provide personalized responses.
- User's financial goals: ${input.goals}
- User's recent transactions: ${input.transactions}
- User's Wealth Wheel assessment: ${input.wheelData}
- User's personal reflections: ${input.reflections}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History:
${input.history}

User's new message:
${input.message}`.trim();

    const result = await ai.generate({
      model: googleAI.model('gemini-1.5-flash-latest'),
      prompt,
    });

    return { response: result.text || 'Sem resposta da IA.' };
  }
);
