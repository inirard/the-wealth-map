import {googleAI} from '@genkit-ai/googleai';

// Esta configuração é primariamente para as ferramentas de desenvolvimento do Genkit.
// A configuração de execução da aplicação está agora em src/ai/genkit.ts.
export default {
  plugins: [
    googleAI(),
  ],
  logLevel: 'debug',
  enableFlowLogs: true,
  // Listar os fluxos aqui permite que as ferramentas do Genkit os descubram.
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
    './src/ai/flows/predictive-insights-flow.ts',
  ],
};
