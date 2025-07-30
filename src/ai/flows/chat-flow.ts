
'use server';
/**
 * @fileOverview A flow for an interactive financial chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Goal, Transaction, WealthWheelData, Reflection } from '@/lib/types';

const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  targetDate: z.string(),
  importance: z.string().optional(),
});

const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  date: z.string(),
});

const WealthWheelDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  description: z.string(),
});

const ReflectionSchema = z.object({
    id: z.string(),
    prompt: z.string(),
    content: z.string(),
});

const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

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


export const ChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user's message. It must be in the language specified in the input."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


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
