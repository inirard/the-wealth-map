
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// A chave de API é lida diretamente da variável de ambiente do processo.
// Esta abordagem é mais direta para ambientes como o Firebase App Hosting.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Esta verificação é crucial para a depuração em produção.
  // Se a chave não for encontrada, a aplicação falhará com uma mensagem clara.
  console.error("A variável de ambiente GEMINI_API_KEY não foi encontrada.");
  throw new Error("A variável de ambiente GEMINI_API_KEY não foi encontrada ou não está definida.");
}

// Esta é a configuração que será usada pela sua aplicação em execução.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
});
