
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
