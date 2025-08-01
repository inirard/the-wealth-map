// genkit.config.ts - Ajustado para Genkit v1.15.x

import { createConfig } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
// Os plugins abaixo foram comentados porque não estão disponíveis na v1.15.x
// import { genkitEval } from '@genkit-ai/eval';
// import { dotprompt } from '@genkit-ai/dotprompt';

export default createConfig({
  plugins: [
    googleAI(),
    // genkitEval(),  // Ative se o pacote for reinstalado e compatível
    // dotprompt({ promptDir: './src/ai/prompts' }),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  cacheStore: 'firebase',
  enableFlowLogs: true,
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
    './src/ai/flows/predictive-insights-flow.ts',
  ],
});
