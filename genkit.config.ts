import {googleAI} from '@genkit-ai/googleai';

// This configuration is primarily for the Genkit developer tools.
// The application's runtime configuration is now in src/ai/genkit.ts.
export default {
  plugins: [
    googleAI(),
  ],
  models: [
    {
      name: 'gemini-pro',
      path: 'gemini-pro',
    }
  ],
  logLevel: 'debug',
  enableFlowLogs: true,
};
