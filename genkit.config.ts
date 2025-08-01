
// genkit.config.ts – Configuração compatível com Genkit v1.15.x
// Mantém apenas plugins estáveis (GoogleAI) e flows locais

import { googleAI } from '@genkit-ai/googleai';

export default {
  plugins: [
    googleAI(),
    // ✅ Caso futuramente a integração Firebase seja atualizada,
    // basta importar e ativar aqui o novo plugin compatível
  ],
  traceStore: 'firebase', // Mantém Firebase como destino de logs, se configurado
  cacheStore: 'firebase',
  enableFlowLogs: true,
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
    './src/ai/flows/predictive-insights-flow.ts',
  ],
};
