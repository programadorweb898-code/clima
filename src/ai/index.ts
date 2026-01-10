'use server';
// This is the entry point for Genkit in production.
import {config} from 'dotenv';
import './genkit';

// Load environment variables from .env file.
config();

// Import all the flow files.
import './flows/summarize-current-weather';
import './flows/get-real-weather';
import './flows/weather-assistant-flow';

// The Genkit server is started automatically by Next.js
// when you import flows in a Next.js app with @genkit-ai/next
