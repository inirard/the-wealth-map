
import { NextResponse } from "next/server";
import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import { ChatInputSchema, GenerateInsightsInputSchema, PredictiveInsightsInputSchema } from '@/lib/ai-types';
import { generateInsightsFlow } from "@/ai/flows/generate-insights-flow";
import { predictiveInsightsFlow } from "@/ai/flows/predictive-insights-flow";
import { chatFlow } from "@/ai/flows/chat-flow";

// Helper function to initialize Genkit
const initializeGenkit = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("A chave da API Gemini não foi encontrada no ambiente.");
  }
  return genkit({
    plugins: [googleAI({ apiKey })],
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { flow, payload } = body;

    if (!flow || !payload) {
      return NextResponse.json({ error: "O 'flow' e o 'payload' são obrigatórios." }, { status: 400 });
    }
    
    initializeGenkit();

    let result;

    switch (flow) {
      case 'chat':
        const chatInput = ChatInputSchema.safeParse(payload);
        if (!chatInput.success) {
          return NextResponse.json({ error: "Payload inválido para 'chat'." }, { status: 400 });
        }
        result = await chatFlow(chatInput.data);
        break;
      case 'generateInsights':
        const insightsInput = GenerateInsightsInputSchema.safeParse(payload);
        if (!insightsInput.success) {
          return NextResponse.json({ error: "Payload inválido para 'generateInsights'." }, { status: 400 });
        }
        result = await generateInsightsFlow(insightsInput.data);
        break;
      case 'predictFinancialFuture':
        const predictiveInput = PredictiveInsightsInputSchema.safeParse(payload);
        if (!predictiveInput.success) {
            return NextResponse.json({ error: "Payload inválido para 'predictFinancialFuture'." }, { status: 400 });
        }
        result = await predictiveInsightsFlow(predictiveInput.data);
        break;
      default:
        return NextResponse.json({ error: "Flow desconhecido." }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error(`Erro na rota /api/ai para o flow:`, error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar a IA." },
      { status: 500 }
    );
  }
}
