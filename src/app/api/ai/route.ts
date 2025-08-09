
import {NextResponse} from 'next/server';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Import the specific flow functions
import {chatFlow} from '@/ai/flows/chat-flow';
import {generateInsights} from '@/ai/flows/generate-insights-flow';
import {predictiveInsights} from '@/ai/flows/predictive-insights-flow';

import {
  ChatInputSchema,
  GenerateInsightsInputSchema,
  PredictiveInsightsInputSchema,
} from '@/lib/ai-types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {flow, payload} = body;

    if (!flow || !payload) {
      return NextResponse.json(
        {error: "Os campos 'flow' e 'payload' são obrigatórios."},
        {status: 400}
      );
    }
    
    // Initialize Genkit with the API key from environment variables.
    // This is secure and works in both local dev (from .env) and production (from Secret Manager).
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables.');
      return NextResponse.json(
        {error: 'A chave da API Gemini não foi encontrada no ambiente.'},
        {status: 500}
      );
    }
    
    genkit({
      plugins: [googleAI({apiKey})],
    });

    let result;

    // Use a switch to route to the correct flow based on the 'flow' parameter
    switch (flow) {
      case 'chat': {
        const chatInput = ChatInputSchema.safeParse(payload);
        if (!chatInput.success) {
          return NextResponse.json(
            {error: "Payload inválido para 'chat'.", details: chatInput.error.format()},
            {status: 400}
          );
        }
        result = await chatFlow(chatInput.data);
        break;
      }
      case 'generateInsights': {
        const insightsInput = GenerateInsightsInputSchema.safeParse(payload);
        if (!insightsInput.success) {
          return NextResponse.json(
            {error: "Payload inválido para 'generateInsights'.", details: insightsInput.error.format()},
            {status: 400}
          );
        }
        result = await generateInsights(insightsInput.data);
        break;
      }
      case 'predictFinancialFuture': {
        const predictiveInput = PredictiveInsightsInputSchema.safeParse(payload);
        if (!predictiveInput.success) {
          return NextResponse.json(
            {error: "Payload inválido para 'predictFinancialFuture'.", details: predictiveInput.error.format()},
            {status: 400}
          );
        }
        result = await predictiveInsights(predictiveInput.data);
        break;
      }
      default:
        return NextResponse.json({error: 'Flow desconhecido.'}, {status: 400});
    }

    return NextResponse.json({success: true, data: result});
  } catch (error: any) {
    console.error(`Erro na rota /api/ai:`, error);
    return NextResponse.json(
      {error: error.message || 'Erro interno ao processar a IA.'},
      {status: 500}
    );
  }
}
