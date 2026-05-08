import { sendOtp as msg91SendOtp, verifyOtp as msg91VerifyOtp } from '../services/msg91.service.js';

// Track verified phones for callback initiation
const verifiedPhones = new Set();

export async function sendOtp(req, res, next) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^\+?[1-9]\d{6,14}$/.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Valid phone number with country code is required (e.g., 919876543210).',
      });
    }

    // MSG91 expects number with country code but no +
    const mobile = phoneNumber.replace('+', '');

    await msg91SendOtp(mobile);

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

    const mobile = phoneNumber.replace('+', '');
    const verified = await msg91VerifyOtp(mobile, otp);

    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Invalid or expired OTP.' });
    }

    verifiedPhones.add(phoneNumber);
    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
}

export function isPhoneVerified(phoneNumber) {
  return verifiedPhones.has(phoneNumber);
}

export function clearVerification(phoneNumber) {
  verifiedPhones.delete(phoneNumber);
}
