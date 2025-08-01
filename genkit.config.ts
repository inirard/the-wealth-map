
// genkit.config.ts – Configuração compatível com Genkit v1.15.x
// Mantém apenas plugins estáveis (GoogleAI) e flows locais

import { googleAI } from '@genkit-ai/googleai';

export default {
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableFlowLogs: true,
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
    './src/ai/flows/predictive-insights-flow.ts',
  ],
};
