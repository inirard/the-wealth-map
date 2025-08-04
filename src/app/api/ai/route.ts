import {NextResponse} from 'next/server';
import {genkit, Flow} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

import {chatFlow, ChatInputSchema} from '@/ai/flows/chat-flow';
import {
  generateInsights,
  GenerateInsightsInputSchema,
} from '@/ai/flows/generate-insights-flow';
import {
  predictiveInsights,
  PredictiveInsightsInputSchema,
} from '@/ai/flows/predictive-insights-flow';

// Central map to associate flow names with their functions and validation schemas
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

    // Check if the requested flow exists in our map
    if (!flowName || !flowMap[flowName]) {
      return NextResponse.json({error: 'Unknown or invalid flow specified.'}, {status: 400});
    }
    
    // Securely get API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('FATAL: GEMINI_API_KEY is not configured in the environment.');
      return NextResponse.json(
        {error: 'The AI service is not configured on the server. Please contact support.'},
        {status: 500}
      );
    }
    
    // Initialize Genkit with the API key for every request
    genkit({
      plugins: [googleAI({apiKey})],
    });
    
    const {schema, flow} = flowMap[flowName];
    
    // Validate the incoming payload against the specific Zod schema for the flow
    const parsedPayload = schema.safeParse(payload);
    if (!parsedPayload.success) {
      return NextResponse.json(
        {
          error: `Invalid data provided for the '${flowName}' flow.`,
          details: parsedPayload.error.format(),
        },
        {status: 400}
      );
    }
    
    // Execute the flow with the validated data
    const result = await flow(parsedPayload.data);
    
    // Return the successful result
    return NextResponse.json({success: true, data: result});

  } catch (error: any) {
    console.error(`Error processing /api/ai for flow:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    return NextResponse.json(
      {error: errorMessage},
      {status: 500}
    );
  }
}
