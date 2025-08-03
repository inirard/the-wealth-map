
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
    console.error("GEMINI_API_KEY not found in environment variables.");
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
      return NextResponse.json({ error: "Os campos 'flow' e 'payload' são obrigatórios." }, { status: 400 });
    }
    
    const ai = initializeGenkit();

    let result;

    switch (flow) {
      case 'chat': {
        const chatInput = ChatInputSchema.safeParse(payload);
        if (!chatInput.success) {
          return NextResponse.json({ error: "Payload inválido para 'chat'.", details: chatInput.error.format() }, { status: 400 });
        }
        result = await chatFlow(chatInput.data, ai);
        break;
      }
      case 'generateInsights': {
        const insightsInput = GenerateInsightsInputSchema.safeParse(payload);
        if (!insightsInput.success) {
          return NextResponse.json({ error: "Payload inválido para 'generateInsights'.", details: insightsInput.error.format() }, { status: 400 });
        }
        result = await generateInsightsFlow(insightsInput.data, ai);
        break;
      }
      case 'predictFinancialFuture': {
        const predictiveInput = PredictiveInsightsInputSchema.safeParse(payload);
        if (!predictiveInput.success) {
          return NextResponse.json({ error: "Payload inválido para 'predictFinancialFuture'.", details: predictiveInput.error.format() }, { status: 400 });
        }
        result = await predictiveInsightsFlow(predictiveInput.data, ai);
        break;
      }
      default:
        return NextResponse.json({ error: "Flow desconhecido." }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error: any) {
    console.error(`Error in /api/ai for flow '${body?.flow}':`, error);
    return NextResponse.json(
      { error: error.message || "Erro interno ao processar a IA." },
      { status: 500 }
    );
  }
}
