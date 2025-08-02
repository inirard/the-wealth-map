import { z } from "zod";

export const PredictiveInsightsInputSchema = z.object({
  data: z.string().min(5, "Os dados fornecidos são insuficientes para previsão."),
  language: z.enum(["pt", "en", "es", "fr"]).optional(),
  goals: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      targetAmount: z.number().optional(),
      currentAmount: z.number().optional(),
      targetDate: z.string().optional(),
      importance: z.string().optional(),
    })
  ).optional(),
  transactions: z.array(
    z.object({
      type: z.enum(["income", "expense"]).optional(),
      date: z.string().optional(),
      id: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
    })
  ).optional(),
  currentDate: z.string().optional(),
});

/**
 * Flow para gerar previsões financeiras com base nos dados fornecidos.
 * @param input - Dados validados para previsão.
 * @param ai - Instância inicializada do Genkit.
export async function predictiveInsightsFlow(input: z.infer<typeof PredictiveInsightsInputSchema>, ai: any) {
  try {
    const prompt = `
      Com base nestes dados financeiros:
      ${input.data}
      
      Faça uma previsão para os próximos 6 meses, destacando:
 import { z } from "zod";

 export const PredictiveInsightsInputSchema = z.object({
  language: z.enum(["pt", "en", "es", "fr"]).optional(),
      - Possíveis riscos
      - Sugestões para melhorar resultados
      
      Responda em até 5 frases curtas.
    `;

    const result = await ai.generateText({
      prompt,
      temperature: 0.5,
      maxOutputTokens: 400,
    });

    return {
  goals: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      targetAmount: z.number().optional(),
      currentAmount: z.number().optional(),
      targetDate: z.string().optional(),
      importance: z.string().optional(),
    })
  ).optional(),
  transactions: z.array(
    z.object({
      type: z.enum(["income", "expense"]).optional(),
      date: z.string().optional(),
      id: z.string().optional(),
      description: z.string().optional(),
      amount: z.number().optional(),
    })
  ).optional(),
  currentDate: z.string().optional(),
});

/**
 * Flow para gerar previsões financeiras com base nos dados fornecidos.
 * @param input - Dados validados para previsão.
 * @param ai - Instância inicializada do Genkit.
 */
export async function predictiveInsightsFlow(
  input: z.infer<typeof PredictiveInsightsInputSchema>,
  ai?: any
) {
  try {
    if (!ai) throw new Error("Instância da IA não encontrada.");

    const prompt = `
      Com base nos seguintes dados financeiros:
      Idioma: ${input.language || "pt"}
      Metas: ${JSON.stringify(input.goals || [])}
      Transações: ${JSON.stringify(input.transactions || [])}
      Data Atual: ${input.currentDate || "não informada"}

      Faça uma previsão para os próximos 6 meses, destacando:
      - Tendências de crescimento ou queda
      - Possíveis riscos
      - Sugestões práticas para melhorar resultados

      Responda em até 5 frases curtas.
    `;

    const result = await ai.generateText({
      prompt,
      temperature: 0.5,
      maxOutputTokens: 400,
    });

    return {
      prediction:
        (result as any)?.output || "Não foi possível gerar a previsão financeira.",
    };
  } catch (error: any) {
    console.error("Erro no predictiveInsightsFlow:", error);
    throw new Error("Erro ao gerar previsão financeira.");
  }
}