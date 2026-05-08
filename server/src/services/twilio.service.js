import twilio from 'twilio';
import config from '../config/env.js';

let client = null;

function getClient() {
  if (!client) {
    if (!config.twilioAccountSid.startsWith('AC')) {
      throw new Error('Twilio is not configured. Please set valid TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in server/.env');
    }
    client = twilio(config.twilioAccountSid, config.twilioAuthToken);
  }
  return client;
}

export async function sendSms(to, body) {
  const message = await getClient().messages.create({
    body,
    from: config.twilioPhoneNumber,
    to,
  });
  return message.sid;
}

export async function makeCall(to, twimlUrl) {
  const call = await getClient().calls.create({
    url: twimlUrl,
    from: config.twilioPhoneNumber,
    to,
  });
  return call.sid;
}
