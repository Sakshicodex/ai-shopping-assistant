import { isPhoneVerified, clearVerification } from '../utils/otpStore.js';
import { makeCall } from '../services/twilio.service.js';
import config from '../config/env.js';

// Store AI responses keyed by call SID for the TwiML webhook
const callResponses = new Map();

export async function initiateCallback(req, res, next) {
  try {
    const { phoneNumber, query, aiResponse } = req.body;

    if (!phoneNumber || !aiResponse) {
      return res.status(400).json({ error: 'Phone number and AI response are required.' });
    }

    if (!isPhoneVerified(phoneNumber)) {
      return res.status(403).json({ error: 'Phone number not verified. Please complete OTP verification first.' });
    }

    const twimlUrl = `${config.baseUrl}/api/callback/twiml`;

    const callSid = await makeCall(phoneNumber, twimlUrl);

    // Store the response so the TwiML webhook can read it
    callResponses.set(callSid, {
      query,
      aiResponse,
      createdAt: Date.now(),
    });

    // Clean up old entries (older than 10 minutes)
    for (const [sid, data] of callResponses) {
      if (Date.now() - data.createdAt > 10 * 60 * 1000) {
        callResponses.delete(sid);
      }
    }

    clearVerification(phoneNumber);

    res.json({ success: true, callSid });
  } catch (err) {
    next(err);
  }
}

export function serveTwiml(req, res) {
  const callSid = req.body?.CallSid || req.query?.CallSid;
  const stored = callSid ? callResponses.get(callSid) : null;

  const message = stored
    ? `Hello! This is ShopSmart calling. ${stored.aiResponse}`
    : 'Hello! This is ShopSmart. Thank you for your inquiry. One of our team members will follow up with you shortly. Goodbye!';

  res.type('text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna" language="en-US">${escapeXml(message)}</Say>
  <Pause length="1"/>
  <Say voice="Polly.Joanna" language="en-US">If you have any more questions, feel free to chat with us on our website. Goodbye!</Say>
</Response>`);

  if (callSid) {
    callResponses.delete(callSid);
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
