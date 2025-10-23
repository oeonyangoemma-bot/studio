import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig() || {};

// Use the API key from runtime config if available, otherwise fallback to env var
const apiKey = serverRuntimeConfig?.geminiApiKey || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'GEMINI_API_KEY is not set. Please set it in your .env file or Netlify environment variables.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey: apiKey})],
  model: 'googleai/gemini-2.5-flash',
});
