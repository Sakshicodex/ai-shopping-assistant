import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../../.env') });

const required = [
  'GROQ_API_KEY',
  'TABBLY_API_KEY',
  'TABBLY_ORG_ID',
  'TABBLY_AGENT_ID',
  'TABBLY_PHONE_NUMBER',
  'TWOFACTOR_API_KEY',
];

for (const key of required) {
  if (!process.env[key] || process.env[key].startsWith('your_')) {
    console.warn(`Warning: ${key} is not configured.`);
  }
}

export default {
  groqApiKey: process.env.GROQ_API_KEY,
  tabblyApiKey: process.env.TABBLY_API_KEY,
  tabblyOrgId: process.env.TABBLY_ORG_ID,
  tabblyAgentId: process.env.TABBLY_AGENT_ID,
  tabblyPhoneNumber: process.env.TABBLY_PHONE_NUMBER,
  twofactorApiKey: process.env.TWOFACTOR_API_KEY,
  port: parseInt(process.env.PORT || '3001', 10),
};
