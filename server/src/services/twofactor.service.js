import config from '../config/env.js';

const BASE_URL = 'https://2factor.in/API/V1';

export async function sendOtp(phoneNumber) {
  const phone = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;
  const res = await fetch(`${BASE_URL}/${config.twofactorApiKey}/SMS/${phone}/AUTOGEN`);
  const data = await res.json();
  if (data.Status !== 'Success') {
    throw new Error(data.Details || 'Failed to send OTP');
  }
  return data.Details;
}

export async function verifyOtp(sessionId, otp) {
  const res = await fetch(`${BASE_URL}/${config.twofactorApiKey}/SMS/VERIFY/${sessionId}/${otp}`);
  const data = await res.json();
  return data.Status === 'Success';
}
