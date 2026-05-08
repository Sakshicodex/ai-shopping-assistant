import { chat } from '../services/claude.service.js';

export async function handleChat(req, res, next) {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: message.trim() },
    ];

    const { reply, offerCallback } = await chat(messages);

    // Parse [ORDER:PRODID:QTY,...] tag
    const orderMatch = reply.match(/\[ORDER:([\w:,]+)\]/);
    let orderItems = null;

    if (orderMatch) {
      orderItems = orderMatch[1].split(',').map((entry) => {
        const [productId, quantity] = entry.split(':');
        return { productId, quantity: parseInt(quantity, 10) || 1 };
      });
    }

    const cleanReply = reply.replace(/\[ORDER:[\w:,]+\]/, '').trim();

    res.json({ reply: cleanReply, offerCallback, orderItems });
  } catch (err) {
    next(err);
  }
}
