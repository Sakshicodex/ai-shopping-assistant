import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const required = ['GROQ_API_KEY'];
const optional = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

for (const key of optional) {
  if (!process.env[key] || process.env[key].startsWith('your_')) {
    console.warn(`Warning: ${key} is not configured. Voice callback features will be unavailable.`);
  }
}

export default {
  groqApiKey: process.env.GROQ_API_KEY,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  port: parseInt(process.env.PORT || '3001', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
};
