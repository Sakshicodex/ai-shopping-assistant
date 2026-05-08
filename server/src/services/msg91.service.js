import config from '../config/env.js';

const BASE_URL = 'https://control.msg91.com/api/v5';

export async function sendOtp(mobile) {
  const response = await fetch(`${BASE_URL}/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: config.msg91AuthKey,
    },
    body: JSON.stringify({
      mobile,
      template_id: config.msg91TemplateId,
      otp_length: 6,
      otp_expiry: 5,
    }),
  });

  const data = await response.json();

  if (data.type === 'error') {
    throw new Error(data.message || 'Failed to send OTP');
  }

  return data;
}

export async function verifyOtp(mobile, otp) {
  const response = await fetch(
    `${BASE_URL}/otp/verify?mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`,
    {
      method: 'GET',
      headers: {
        authkey: config.msg91AuthKey,
      },
    }
  );

  const data = await response.json();
  return data.type === 'success';
}
