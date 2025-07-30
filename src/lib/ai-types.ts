import {z} from 'genkit';

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

export const GenerateInsightsInputSchema = z.object({
  language: z.enum(['pt', 'en', 'es', 'fr']),
  goals: z.array(GoalSchema),
  transactions: z.array(TransactionSchema),
  wheelData: z.array(WealthWheelDataSchema),
  reflections: z.array(ReflectionSchema),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;


export const GenerateInsightsOutputSchema = z.object({
  analysis: z.string().describe('A concise, encouraging, and actionable financial analysis paragraph for the user. It should be in the language specified in the input.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;
