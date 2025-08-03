
import { z } from "zod";
import { ChatInputSchema } from '@/lib/ai-types';

/**
 * Flow para gerar respostas de chat usando Gemini.
 * @param input - Dados validados do chat.
 * @param ai - Instância inicializada do Genkit.
 */
export async function chatFlow(
  input: z.infer<typeof ChatInputSchema>,
  ai: any
) {
  if (!ai) throw new Error("Instância da IA não encontrada.");

  const prompt = `You are "The Wealth Map AI Coach", a friendly, encouraging, and helpful financial assistant.
Your answers MUST be in the user's specified language: ${input.language}.

You have access to the user's financial data to provide personalized responses.
- User's financial goals: ${input.goals.length > 0 ? JSON.stringify(input.goals) : 'No goals set.'}
- User's recent transactions: ${input.transactions.length > 0 ? JSON.stringify(input.transactions) : 'No transactions recorded.'}
- User's Wealth Wheel assessment: ${input.wheelData.length > 0 ? JSON.stringify(input.wheelData) : 'Not completed.'}
- User's personal reflections: ${input.reflections.length > 0 ? JSON.stringify(input.reflections) : 'No reflections written.'}

Based on this context and the conversation history, provide a concise and helpful response to the user's message.

Conversation History:
${input.history.map(m => `${m.role === 'model' ? 'AI' : 'User'}: ${m.content}`).join('\n')}

User's new message:
${input.message}
`;

  const { output } = await ai.generate({
    prompt: prompt,
    model: 'googleai/gemini-pro',
    config: {
      temperature: 0.7,
    }
  });

  return { response: output?.text || "Não foi possível gerar uma resposta no momento." };
}
