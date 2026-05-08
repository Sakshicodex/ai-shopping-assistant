import { generateOtp, verifyOtp as verifyOtpStore } from '../utils/otpStore.js';
import { sendSms } from '../services/twilio.service.js';

export async function sendOtp(req, res, next) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^\+[1-9]\d{6,14}$/.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Valid phone number in E.164 format is required (e.g., +1234567890).',
      });
    }

    const otp = generateOtp(phoneNumber);
    await sendSms(phoneNumber, `Your ShopSmart verification code is: ${otp}. It expires in 5 minutes.`);

    res.json({ success: true, message: 'OTP sent successfully.' });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ error: 'Phone number and OTP are required.' });
    }

    const verified = verifyOtpStore(phoneNumber, otp);

    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Invalid or expired OTP.' });
    }

    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
}
