import {defineConfig} from '@genkit-ai/core';
import {googleAI} from '@genkit-ai/googleai';
import {genkitEval} from '@genkit-ai/eval';
import {dotprompt} from '@genkit-ai/dotprompt';

export default defineConfig({
  plugins: [
    googleAI(),
    genkitEval(),
    dotprompt({
      promptDir: './src/ai/prompts',
    }),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  cacheStore: 'firebase',
  enableFlowLogs: true,
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
  ],
});
