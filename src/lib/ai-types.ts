import {z} from 'genkit';

export const GoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetAmount: z.number(),
  currentAmount: z.number(),
  targetDate: z.string(),
  importance: z.string(),
});
export type Goal = z.infer<typeof GoalSchema>;

export const TransactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.enum(['income', 'expense']),
  date: z.string(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const WealthWheelDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  description: z.string(),
});
export type WealthWheelData = z.infer<typeof WealthWheelDataSchema>;

export const ReflectionSchema = z.object({
    id: z.string(),
    prompt: z.string(),
    content: z.string(),
});
export type Reflection = z.infer<typeof ReflectionSchema>;

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

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


export const ChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response to the user's message. It must be in the language specified in the input."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export const GenerateInsightsInputSchema = z.object({
  language: z.enum(['pt', 'en', 'es', 'fr']),
  goals: z.string().describe("A JSON string of the user's goals."),
  transactions: z.string().describe("A JSON string of the user's transactions."),
  wheelData: z.string().describe("A JSON string of the user's Wealth Wheel assessment."),
  reflections: z.string().describe("A JSON string of the user's personal reflections."),
});
export type GenerateInsightsInput = z.infer<typeof GenerateInsightsInputSchema>;


export const GenerateInsightsOutputSchema = z.object({
  analysis: z.string().describe('A concise, encouraging, and actionable financial analysis paragraph for the user. It should be in the language specified in the input.'),
});
export type GenerateInsightsOutput = z.infer<typeof GenerateInsightsOutputSchema>;

export const PredictiveInsightsInputSchema = z.object({
    language: z.enum(['pt', 'en', 'es', 'fr']),
    goals: z.string().describe("A JSON string of the user's goals."),
    transactions: z.string().describe("A JSON string of the user's transactions."),
    currentDate: z.string().describe('The current date in ISO format.'),
});
export type PredictiveInsightsInput = z.infer<typeof PredictiveInsightsInputSchema>;

export const PredictiveInsightsOutputSchema = z.object({
    futureBalancePrediction: z.string().describe("Prediction of the user's future balance for the end of the current month. Must be in the specified language."),
    goalProjections: z.array(z.object({
        goalName: z.string(),
        projection: z.string().describe("Projection for when the user might achieve the goal. Must be in the specified language."),
    })).describe("An array of projections for each of the user's financial goals."),
    spendingAnalysis: z.string().describe("Analysis of spending patterns with a suggestion for a cut. Must be in the specified language."),
    proactiveAlerts: z.array(z.string()).describe("An array of automated alerts based on spending patterns. Must be in the specified language."),
    whatIfScenario: z.string().describe("A 'what if' scenario to motivate the user. Must be in the specified language."),
});
export type PredictiveInsightsOutput = z.infer<typeof PredictiveInsightsOutputSchema>;
