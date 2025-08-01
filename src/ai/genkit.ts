import 'dotenv/config';
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta é a configuração que será usada pela sua aplicação em execução.
// Ao importar 'dotenv/config', garantimos que a GEMINI_API_KEY do ficheiro .env é carregada.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
