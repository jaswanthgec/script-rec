import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// Log a warning if the API key is not set during development (server-side only)
if (!apiKey && process.env.NODE_ENV !== 'production' && typeof window === 'undefined') {
  console.warn(
    '\x1b[33m%s\x1b[0m', // Yellow text
    `[ScriptAssist] WARNING: GEMINI_API_KEY or GOOGLE_API_KEY is not set in your .env file. \n` +
    `The AI features of the application will not work until it is provided. \n` +
    `Please obtain a key from Google AI Studio and add it to your .env file (e.g., GEMINI_API_KEY=your_actual_api_key).\n` +
    `Then, restart your development server.`
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey, // Explicitly pass the API key; plugin will error if it's undefined and required
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
