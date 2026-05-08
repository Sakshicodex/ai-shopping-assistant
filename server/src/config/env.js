import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const required = ['GROQ_API_KEY', 'MSG91_AUTH_KEY', 'MSG91_TEMPLATE_ID'];
const optional = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

for (const key of optional) {
  if (!process.env[key] || process.env[key].startsWith('your_')) {
    console.warn(`Warning: ${key} is not configured. Voice call feature will be unavailable.`);
  }
}

export default {
  groqApiKey: process.env.GROQ_API_KEY,
  msg91AuthKey: process.env.MSG91_AUTH_KEY,
  msg91TemplateId: process.env.MSG91_TEMPLATE_ID,
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  port: parseInt(process.env.PORT || '3001', 10),
  baseUrl: process.env.BASE_URL || 'http://localhost:3001',
};
