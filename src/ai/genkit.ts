
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      // Usa uma função para obter a chave da API no momento da execução.
      // Isto garante que 'process.env' está disponível no ambiente do servidor de produção.
      apiKey: () => process.env.GEMINI_API_KEY || '',
    }),
  ],
});
