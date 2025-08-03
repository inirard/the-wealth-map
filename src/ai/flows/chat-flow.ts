
import { z } from "zod";

export const ChatInputSchema = z.object({
  message: z.string().min(1, "A mensagem não pode estar vazia."),
  context: z.string().optional(),
});

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

  const result = await ai.generateText({
    prompt: input.context ? `${input.context}\nUsuário: ${input.message}` : input.message,
    temperature: 0.7,
    maxOutputTokens: 500,
  });

  return { response: result?.output || "Não foi possível gerar uma resposta no momento." };
}
