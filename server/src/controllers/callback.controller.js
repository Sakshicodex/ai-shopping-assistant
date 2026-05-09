import { triggerCall } from '../services/tabbly.service.js';

export async function initiateCallback(req, res, next) {
  try {
    const { phoneNumber, query, aiResponse } = req.body;

    if (!phoneNumber || !aiResponse) {
      return res.status(400).json({ error: 'Phone number and AI response are required.' });
    }

    const firstLine = 'Hi! This is ShopSmart AI calling. I have some detailed information about your query.';

    const customInstruction = `You are ShopSmart's AI voice assistant. The customer had this query: "${query}".
Here is the context to discuss with them: ${aiResponse}.
Be helpful, friendly, and thorough in explaining. Ask if they have any follow-up questions.
Speak in the language the customer speaks (Hindi or English).`;

    const result = await triggerCall(phoneNumber, firstLine, customInstruction);

    res.json({ success: true, callId: result.room_name || 'initiated' });
  } catch (err) {
    next(err);
  }
}
