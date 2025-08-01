// genkit.config.ts
import {configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {firebase} from '@genkit-ai/firebase';

export default configureGenkit({
  plugins: [
    firebase(), // Configures Firebase for flow state, trace store, and cache
    googleAI(),
  ],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
  cacheStore: 'firebase',
  enableFlowLogs: true,
});
