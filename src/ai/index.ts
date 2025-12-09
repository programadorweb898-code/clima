// This is the entry point for Genkit in production.
import { start } from '@genkit-ai/next';
import { config } from 'dotenv';

// Load environment variables from .env file.
config();

// Import all the flow files.
import './flows/summarize-current-weather';
import './flows/get-real-weather';
import './flows/weather-assistant-flow';

// Start the Genkit server.
start();
