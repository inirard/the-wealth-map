import {NextResponse} from 'next/server';
import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';
import {validKeys} from '@/lib/keys';
import {checkRateLimit} from '@/lib/server-rate-limiter';

import {chatFlow} from '@/ai/flows/chat-flow';
import {generateInsights} from '@/ai/flows/generate-insights-flow';
import {predictiveInsights} from '@/ai/flows/predictive-insights-flow';

import {
  ChatInputSchema,
  GenerateInsightsInputSchema,
  PredictiveInsightsInputSchema,
} from '@/lib/ai-types';

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
    const {flow: flowName, payload, licenseKey} = body;

    // Validar chave de licença
    if (!licenseKey || !validKeys.includes(licenseKey)) {
      return NextResponse.json(
        {error: 'Chave de licença inválida ou em falta.'},
        {status: 401}
      );
    }

    // Rate limiting server-side
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    req.headers.get('remote-addr') || 
                    'unknown';
    
    const rateLimitInfo = checkRateLimit(licenseKey, clientIP);
    
    if (!rateLimitInfo.isAllowed) {
      const resetTime = new Date(rateLimitInfo.resetTime).toLocaleTimeString('pt-PT');
      return NextResponse.json(
        {
          error: 'Limite de uso atingido',
          details: `Limite de 50 requests por hora excedido. Resets às ${resetTime}. Restam ${rateLimitInfo.remainingRequests} requests.`,
          remainingRequests: rateLimitInfo.remainingRequests,
          resetTime: rateLimitInfo.resetTime
        },
        {status: 429}
      );
    }

    if (!flowName || !flowMap[flowName]) {
      return NextResponse.json({error: 'Unknown flow.'}, {status: 400});
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables.');
      return NextResponse.json(
        {error: 'The Gemini API key was not found in the environment.'},
        {status: 500}
      );
    }

    genkit({
      plugins: [googleAI({apiKey})],
    });

    const {schema, flow} = flowMap[flowName];
    
    const parsedPayload = schema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: `Invalid payload for '${flowName}'.`,
          details: parsedPayload.error.format(),
        },
        {status: 400}
      );
    }

    const result = await flow(parsedPayload.data);

    return NextResponse.json({success: true, data: result});
  } catch (error: any) {
    console.error(`Error in /api/ai route:`, error);
    const errorMessage =
      error instanceof Error ? error.message : 'An internal error occurred while processing the AI request.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
