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

// Helper function to convert data arrays to JSON strings
function preprocessPayload(payload: any) {
  const newPayload = {...payload};
  for (const key of ['goals', 'transactions', 'wheelData', 'reflections']) {
    if (Array.isArray(newPayload[key])) {
      newPayload[key] = newPayload[key].length > 0 ? JSON.stringify(newPayload[key]) : 'No data provided.';
    }
  }
   if (Array.isArray(newPayload.history)) {
     newPayload.history = newPayload.history.map((msg: any) => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`).join('\n') || 'No history.';
  }
  return newPayload;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {flow: flowName, payload, licenseKey} = body;
    
    // Server-side rate limiting check (placeholder)
    if (!licenseKey) {
        return NextResponse.json({error: 'License key is required.'}, {status: 401});
    }
    // TODO: Implement persistent rate limiting logic here (e.g., using a database or Redis)

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
    
    // Preprocess payload to convert arrays to JSON strings
    const processedPayload = preprocessPayload(payload);
    
    // Validate the incoming payload against the specific Zod schema for the flow
    const parsedPayload = schema.safeParse(processedPayload);
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
