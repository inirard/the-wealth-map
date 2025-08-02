
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {next} from '@genkit-ai/next';
import getConfig from 'next/config';

const {serverRuntimeConfig} = getConfig() || {};

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    next({
      // O plugin do Next.js gere a obtenção da chave de forma automática e segura.
    }),
    googleAI({
      apiKey: serverRuntimeConfig?.geminiApiKey,
    }),
  ],
});
