
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig() || { serverRuntimeConfig: {} };

// A chave de API é lida a partir da configuração de tempo de execução do servidor Next.js,
// que é a forma correta de aceder a segredos do lado do servidor em produção.
const apiKey = serverRuntimeConfig.geminiApiKey || process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Esta verificação é crucial para a depuração em produção.
  // Se a chave não for encontrada, a aplicação falhará com uma mensagem clara.
  console.error("A chave da API do Gemini (GEMINI_API_KEY) não foi encontrada na configuração.");
  throw new Error("A chave da API do Gemini (GEMINI_API_KEY) não foi encontrada ou não está definida.");
}

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});
