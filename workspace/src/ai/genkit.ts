import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the configuration that will be used by your running application.
// It reads the GEMINI_API_KEY from the server environment variables.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // This error will be thrown if the API key is not set in the production environment.
  // To fix this, you must run the following command in your terminal:
  // firebase apphosting:env:set GEMINI_API_KEY="YOUR_API_KEY_HERE"
  throw new Error("GEMINI_API_KEY is not defined in the server environment.");
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
