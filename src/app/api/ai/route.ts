import {NextResponse} from 'next/server';
import {genkit, Flow, type Generation} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

// Import the specific flow functions and schemas from their files
import {
  chatFlow,
  ChatInputSchema,
} from '@/ai/flows/chat-flow';
import {
  generateInsights,
  GenerateInsightsInputSchema,
} from '@/ai/flows/generate-insights-flow';
import {
  predictiveInsights,
  PredictiveInsightsInputSchema,
} from '@/ai/flows/predictive-insights-flow';

// Define a map for flows to make routing cleaner and more scalable
const flowMap: Record<
  string,
  {
    schema: z.ZodType<any, any, any>;
    flow: Flow<any, any, any>;
  }
> = {
  chat: {
    schema: ChatInputSchema,
    flow: chatFlow,
  },
  generateInsights: {
    schema: GenerateInsightsInputSchema,
    flow: generateInsights,
  },
  predictFinancialFuture: {
    schema: PredictiveInsightsInputSchema,
    flow: predictiveInsights,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {flow: flowName, payload} = body;

    // Validate if the requested flow exists
    if (!flowName || !flowMap[flowName]) {
      return NextResponse.json({error: 'Flow desconhecido.'}, {status: 400});
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

    const {schema, flow} = flowMap[flowName];

    // Validate the payload against the flow's schema
    const parsedPayload = schema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: `Payload inválido para '${flowName}'.`,
          details: parsedPayload.error.format(),
        },
        {status: 400}
      );
    }

    // Run the flow with the validated data
    const result = await flow(parsedPayload.data);

    return NextResponse.json({success: true, data: result});
  } catch (error: any) {
    console.error(`Erro na rota /api/ai:`, error);
    // Provide a more generic error message to the client
    const errorMessage =
      error instanceof Error ? error.message : 'Erro interno ao processar a IA.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
