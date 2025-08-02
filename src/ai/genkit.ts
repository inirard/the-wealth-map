
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import getConfig from 'next/config';

// Obtém a configuração do servidor do Next.js
const { serverRuntimeConfig } = getConfig() || {};

// A chave de API é lida da serverRuntimeConfig, que por sua vez é preenchida
// pela variável de ambiente GEMINI_API_KEY no App Hosting.
const apiKey = serverRuntimeConfig?.geminiApiKey;


if (!apiKey) {
  // Esta verificação é crucial para o debugging em produção.
  // Se a chave não for encontrada, a aplicação falhará com uma mensagem clara.
  console.error("A variável de ambiente GEMINI_API_KEY não foi encontrada ou não está acessível através da serverRuntimeConfig.");
  throw new Error("A variável de ambiente GEMINI_API_KEY não foi encontrada.");
}

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});
