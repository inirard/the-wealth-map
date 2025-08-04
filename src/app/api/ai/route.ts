
import {NextResponse} from 'next/server';
import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

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
    const {flow: flowName, payload, licenseKey} = body;

    // TODO: Implement a more robust, persistent rate limiting logic here
    // using the licenseKey (e.g., with a database or Redis).
    if (!licenseKey) {
        return NextResponse.json({error: 'Chave de licença em falta.'}, {status: 401});
    }

    const flowMap: Record<string, {schema: z.ZodType<any, any, any>; flow: Flow<any, any, any>;}> = {
        chat: { schema: ChatInputSchema, flow: chatFlow },
        generateInsights: { schema: GenerateInsightsInputSchema, flow: generateInsights },
        predictFinancialFuture: { schema: PredictiveInsightsInputSchema, flow: predictiveInsights },
    };

    const selectedFlow = flowMap[flowName];
    if (!selectedFlow) {
      return NextResponse.json({error: 'Flow desconhecido ou inválido.'}, {status: 400});
    }
    
    // Securely get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('FATAL: GEMINI_API_KEY is not configured in the environment.');
      return NextResponse.json(
        {error: 'O serviço de IA não está configurado no servidor. Por favor, contacte o suporte.'},
        {status: 500}
      );
    }
    
    genkit({
      plugins: [googleAI({apiKey})],
    });
    
    const parsedPayload = selectedFlow.schema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: `Dados inválidos para o flow '${flowName}'.`,
          details: parsedPayload.error.format(),
        },
        {status: 400}
      );
    }
    
    const result = await selectedFlow.flow(parsedPayload.data);
    
    return NextResponse.json({success: true, data: result});

  } catch (error: any) {
    console.error(`Erro ao processar /api/ai:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro interno no servidor.';
    return NextResponse.json(
      {error: errorMessage},
      {status: 500}
    );
  }
}
