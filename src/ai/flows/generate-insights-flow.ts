
import { z } from "zod";
import { GenerateInsightsInputSchema } from '@/lib/ai-types';

/**
 * Flow para gerar insights financeiros com base nos dados fornecidos.
 * @param input - Dados validados para insights.
 * @param ai - Instância inicializada do Genkit.
 */
export async function generateInsightsFlow(
  input: z.infer<typeof GenerateInsightsInputSchema>,
  ai: any
) {
  if (!ai) throw new Error("Instância da IA não encontrada.");

  const prompt = `
    Você é um coach financeiro amigável e positivo para o app "The Wealth Map".
    Sua tarefa é fornecer uma análise curta, personalizada e encorajadora para o usuário com base em seus dados financeiros.
    A resposta deve estar no idioma especificado: ${input.language}.

    Aqui estão os dados do usuário:
    - Metas: ${input.goals.length ? JSON.stringify(input.goals) : 'Nenhuma meta definida.'}
    - Transações: ${input.transactions.length ? JSON.stringify(input.transactions) : 'Nenhuma transação registrada.'}
    - Avaliação da Roda da Riqueza: ${input.wheelData.length ? JSON.stringify(input.wheelData) : 'Não preenchida.'}
    - Reflexões Pessoais: ${input.reflections.length ? JSON.stringify(input.reflections) : 'Nenhuma reflexão escrita.'}

    Com base nesses dados, gere um único parágrafo de análise que faça o seguinte:
    1. Reconheça um ponto positivo específico de suas reflexões ou uma meta em que estão progredindo.
    2. Aponte gentilmente uma área potencial para melhoria, vinculando-a às suas transações ou à sua categoria de menor pontuação na Roda da Riqueza.
    3. Sugira um passo pequeno, concreto e acionável que eles poderiam dar no próximo mês.
    4. Termine com uma frase motivacional e encorajadora.

    Mantenha o tom leve, solidário e sem julgamentos. Não soe como um robô. Escreva como um coach humano faria.
    A análise inteira deve ser um único parágrafo.
  `;
  
  const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-pro',
      config: {
        temperature: 0.7,
      }
  });

  return { analysis: output?.text || 'Não foi possível gerar a análise no momento.' };
}
