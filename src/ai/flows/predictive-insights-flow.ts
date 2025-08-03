
import { z } from "zod";
import { PredictiveInsightsInputSchema } from '@/lib/ai-types';

/**
 * Flow para gerar previsões financeiras com base nos dados fornecidos.
 * @param input - Dados validados para previsão.
 * @param ai - Instância inicializada do Genkit.
 */
export async function predictiveInsightsFlow(
  input: z.infer<typeof PredictiveInsightsInputSchema>,
  ai: any
) {
  if (!ai) throw new Error("Instância da IA não encontrada.");

  const prompt = `
      Você é o "The Wealth Map AI Forecaster", um motor de previsão financeira analítico e perspicaz.
      Sua resposta DEVE estar no idioma especificado pelo usuário: ${input.language}.
      A data atual é ${input.currentDate}.

      Analise os dados financeiros do usuário:
      - Metas: ${input.goals.length ? JSON.stringify(input.goals) : 'Nenhuma meta definida.'}
      - Transações: ${input.transactions.length ? JSON.stringify(input.transactions) : 'Nenhuma transação registrada.'}

      Com base nos dados, gere as seguintes informações preditivas como um objeto JSON:
      {
        "futureBalancePrediction": "Uma previsão realista da variação do saldo líquido do usuário nos próximos 30 dias.",
        "goalProjections": [
          { "goalName": "Nome da Meta 1", "projection": "Uma projeção de quando eles poderiam alcançar esta meta com base em sua taxa de poupança atual." },
          { "goalName": "Nome da Meta 2", "projection": "Projeção para outra meta." }
        ],
        "spendingAnalysis": "Identifique a principal categoria de gastos e sugira uma maneira específica e acionável de reduzi-la.",
        "proactiveAlerts": [
          "Um ou dois alertas de estilo automatizado, como 'Gasto elevado em 'Restaurantes' detectado este mês' ou 'Você está no caminho certo para atingir sua meta de 'Férias'.'"
        ],
        "whatIfScenario": "Crie um cenário 'e se' simples e motivador, como 'Se você economizasse €50 a mais por mês, poderia atingir sua meta de fundo de emergência 3 meses antes.'"
      }

      Sua saída inteira deve ser um objeto JSON válido, sem nenhum texto ou formatação adicional.
  `;

  const result = await ai.generateText({
    prompt: prompt,
    temperature: 0.5,
    maxOutputTokens: 1500,
  });

  try {
    // Tenta analisar o resultado como JSON.
    return JSON.parse(result?.output || '{}');
  } catch (e) {
    console.error("Failed to parse AI prediction JSON:", e);
    // Retorna um objeto de erro se a análise falhar.
    return { 
      futureBalancePrediction: "Não foi possível gerar a previsão de saldo.",
      goalProjections: [],
      spendingAnalysis: "Não foi possível analisar os padrões de gastos.",
      proactiveAlerts: ["Erro ao gerar alertas."],
      whatIfScenario: "Não foi possível criar um cenário."
    };
  }
}
