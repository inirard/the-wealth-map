
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Esta verificação é crucial para o debugging em produção.
  // Se a chave não for encontrada, a aplicação falhará com uma mensagem clara.
  throw new Error("A variável de ambiente GEMINI_API_KEY não foi encontrada.");
}

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
