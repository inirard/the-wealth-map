import {NextResponse} from 'next/server';
import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

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

const flowMap: Record<
  string,
  {
    schema: z.ZodType<any, any, any>;
    flow: Flow<any, any, any>;
    preprocessor?: (payload: any) => any;
  }
> = {
  chat: {
    schema: ChatInputSchema,
    flow: chatFlow,
    preprocessor: (payload) => {
      // The history is now an array of objects, convert it to a simple string log.
      const historyText = payload.history
        .map((msg: {role: string; content: string}) => `${msg.role}: ${msg.content}`)
        .join('\n');
      return { ...payload, history: historyText };
    }
  },
  generateInsights: {
    schema: GenerateInsightsInputSchema,
    flow: generateInsights,
  },
  predictFinancialFuture: {
    schema: PredictiveInsightsInputSchema,
    flow: predictiveInsights,
    preprocessor: (payload) => {
        return {
            ...payload,
            goals: payload.goals.length > 0 ? JSON.stringify(payload.goals) : "No goals set.",
            transactions: payload.transactions.length > 0 ? JSON.stringify(payload.transactions) : "No transactions recorded.",
        };
    }
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {flow: flowName, payload} = body;

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

    const {schema, flow, preprocessor} = flowMap[flowName];
    
    let processedPayload = payload;
    if (preprocessor) {
        processedPayload = preprocessor(payload);
    }

    const parsedPayload = schema.safeParse(processedPayload);
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
