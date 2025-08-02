
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import getConfig from 'next/config';

const {serverRuntimeConfig} = getConfig() || {};

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: serverRuntimeConfig?.geminiApiKey || process.env.GEMINI_API_KEY,
    }),
  ],
});
