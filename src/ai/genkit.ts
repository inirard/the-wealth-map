import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Esta é uma instância genérica do Genkit usada para definir os prompts e fluxos.
// A inicialização real com a chave de API será feita na rota da API (/api/ai)
// para garantir que a chave nunca seja exposta no lado do cliente.
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
