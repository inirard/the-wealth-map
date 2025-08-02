import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import getConfig from 'next/config';

// A chave de API é lida diretamente das variáveis de ambiente configuradas no servidor.
// Para desenvolvimento local, use o ficheiro .env.local.
// Para produção no Firebase App Hosting, defina o segredo com o comando:
// firebase apphosting:secrets:set GEMINI_API_KEY
const { serverRuntimeConfig } = getConfig() || {};
const apiKey = serverRuntimeConfig?.geminiApiKey || process.env.GEMINI_API_KEY;


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
});
