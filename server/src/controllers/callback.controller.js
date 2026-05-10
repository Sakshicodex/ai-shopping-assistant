import { triggerCall } from '../services/tabbly.service.js';
import { isPhoneVerified, clearVerification } from '../utils/otpStore.js';
import { getAllOrders, getOrderStatus } from '../services/catalog.service.js';

function extractOrderIds(text) {
  const ids = new Set();
  const ordMatches = text.match(/ORD-\d+/gi) || [];
  ordMatches.forEach((id) => ids.add(id.toUpperCase()));
  return [...ids];
}

export async function initiateCallback(req, res, next) {
  try {
    const { phoneNumber, query, aiResponse } = req.body;

    if (!phoneNumber || !aiResponse) {
      return res.status(400).json({ error: 'Phone number and AI response are required.' });
    }

    if (!isPhoneVerified(phoneNumber)) {
      return res.status(403).json({ error: 'Phone number is not verified. Please verify via OTP first.' });
    }

    const today = new Date().toISOString().split('T')[0];

    const highlightedOrders = extractOrderIds(`${query} ${aiResponse}`)
      .map((id) => getOrderStatus(id))
      .filter(Boolean);

    const allOrders = getAllOrders();

    const highlightedContext = highlightedOrders.length
      ? `\n## Orders the customer already asked about in chat\n${JSON.stringify(highlightedOrders, null, 2)}\n`
      : '';

    const firstLine = "Hi! This is ShopSmart calling you back — do you have a quick minute to chat about your question?";

    const customInstruction = `You are ShopSmart's customer care voice agent calling a customer back about their question.

Today's date is ${today}.

## Conversation context
The customer asked us this in chat: "${query}"

Earlier our chat assistant told them: "${aiResponse}"
${highlightedContext}
## Full order database (use this to look up ANY order the customer asks about on the call)
${JSON.stringify(allOrders, null, 2)}

## Interpreting spoken order IDs
Customers will say order IDs out loud in many ways. Always normalize to the "ORD-#####" form before looking it up:
- "ten thousand three" / "one zero zero zero three" / "one triple oh three" / "ten oh oh three" → ORD-10003
- "ORD dash one zero zero zero one" / "order one zero zero zero one" → ORD-10001
- If the customer gives just digits (e.g., "10005"), prefix with "ORD-" and look it up.
If you find a match in the order database above, USE that data. Do not say "our team will follow up" for orders that exist in the database.

## How to handle the call
- Wait for them to confirm it's a good time to talk before diving in.
- Acknowledge their question naturally before explaining — don't sound scripted.
- If they sound frustrated or upset, empathize FIRST ("I completely understand, that's frustrating") before explaining anything.
- Keep your explanation conversational — short sentences, pause for them to respond, ask if they have questions as you go.
- If you need information you don't have (email, specific item details), ASK politely. Don't guess or make up details.
- Aim for a 2 to 4 minute call. Don't drag it out.

## What you CAN do
- Look up any order in the database above and explain its status, tracking number, items, and estimated delivery
- Explain delivery timelines, return and refund policy
- Discuss product details, pricing, and recommendations
- Help them understand their options

## What you CANNOT do
- Actually process a refund, modify an order, or change shipping in real time
- Make promises about specific dates or amounts beyond what's in the order database above

If they mention an order ID that is genuinely NOT in the database above (you've checked all spoken-form variations and there's no match), say: "I'm not finding that order on my end — let me have our team pull it up and email you within 24 hours."

If they need an action you can't take, say: "I'll have our team follow up with you by email within 24 hours to take care of that."

## Closing
Always end with: "Is there anything else I can help you with?" Wait for their answer. If nothing else, thank them warmly and end the call.

## Language
Match the customer's language. If they speak Hindi, respond in Hindi. If English, English. Hinglish if they mix. Keep tone friendly and conversational, never formal or robotic.`;

    const result = await triggerCall(phoneNumber, firstLine, customInstruction);

    clearVerification(phoneNumber);

    res.json({ success: true, callId: result.room_name || 'initiated' });
  } catch (err) {
    next(err);
  }
}
