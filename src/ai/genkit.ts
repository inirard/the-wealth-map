
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta é a configuração que será usada pela sua aplicação em execução.
// Com a chave definida no apphosting.yaml, process.env.GEMINI_API_KEY
// estará disponível no ambiente de produção.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
