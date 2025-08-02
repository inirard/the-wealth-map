
import {genkit, configureGenkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This file is now primarily for type-checking and local development.
// The actual Genkit instance for production is created on-demand in the API route.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    }),
  ],
});
