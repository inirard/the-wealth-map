
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
      You are "The Wealth Map AI Forecaster", an analytical and insightful financial prediction engine.
      Your response MUST be in the user's specified language: ${input.language}.
      The current date is ${input.currentDate}.

      Analyze the user's financial data:
      - Goals: ${input.goals.length ? JSON.stringify(input.goals) : 'No goals set.'}
      - Transactions: ${input.transactions.length ? JSON.stringify(input.transactions) : 'No transactions recorded.'}

      Based on the data, generate ONLY a valid JSON object that strictly follows this format:
      {
        "futureBalancePrediction": "A realistic prediction of the user's net balance change over the next 30 days.",
        "goalProjections": [
          { "goalName": "Goal Name 1", "projection": "A projection on when they might achieve this goal based on their current savings rate." },
          { "goalName": "Goal Name 2", "projection": "Projection for another goal." }
        ],
        "spendingAnalysis": "Identify the top spending category and suggest one specific, actionable way to reduce it.",
        "proactiveAlerts": [
          "One or two automated-style alerts, such as 'High spending on 'Eating Out' detected this month' or 'You are on track to meet your 'Vacation' goal.'"
        ],
        "whatIfScenario": "Create a simple, motivating 'what if' scenario, like 'If you saved an extra €50 per month, you could reach your emergency fund goal 3 months sooner.'"
      }

      Do not include any text, formatting, or markdown like \`\`\`json before or after the JSON object.
  `;

  const { output } = await ai.generate({
    prompt: prompt,
    model: 'googleai/gemini-pro',
    config: {
        temperature: 0.5,
    },
    output: {
        format: 'json',
    }
  });

  try {
    const jsonOutput = output?.json;
    if (jsonOutput) {
        return jsonOutput;
    }
    throw new Error("AI output was not valid JSON.");
  } catch (e) {
    console.error("Failed to parse AI prediction JSON:", e, "Raw output:", output?.text);
    return { 
      futureBalancePrediction: "Could not generate balance prediction.",
      goalProjections: [],
      spendingAnalysis: "Could not analyze spending patterns.",
      proactiveAlerts: ["Error generating alerts."],
      whatIfScenario: "Could not create a scenario."
    };
  }
}
