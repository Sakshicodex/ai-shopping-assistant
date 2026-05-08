import Groq from 'groq-sdk';
import config from '../config/env.js';
import { buildSystemPrompt } from '../utils/systemPrompt.js';

const groq = new Groq({ apiKey: config.groqApiKey });

export async function chat(conversationHistory) {
  const systemPrompt = buildSystemPrompt();

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory,
  ];

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  const rawText = response.choices[0]?.message?.content || '';

  const offerCallback = rawText.includes('[COMPLEX_QUERY]');
  const reply = rawText.replace('[COMPLEX_QUERY]', '').trim();

  return { reply, offerCallback };
}
