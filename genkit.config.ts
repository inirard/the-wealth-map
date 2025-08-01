// genkit.config.ts
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase/plugin';
import { firebaseFunctions } from '@genkit-ai/firebase/functions';

export default genkit({
  plugins: [
    firebase(), // Configures Firebase for flow state, trace store, and cache
    googleAI(),
    firebaseFunctions(),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  cacheStore: 'firebase',
  enableFlowLogs: true,
});
