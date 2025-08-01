import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';

export default {
  plugins: [
    googleAI(),
    firebase(),
  ],
  flows: [
    './src/ai/flows/generate-insights-flow.ts',
    './src/ai/flows/chat-flow.ts',
    './src/ai/flows/predictive-insights-flow.ts',
  ],
  logLevel: 'debug',
  enableFlowState: true,
};
