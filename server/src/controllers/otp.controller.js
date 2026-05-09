import { sendOtp as send2FactorOtp, verifyOtp as verify2FactorOtp } from '../services/twofactor.service.js';
import {
  setSession,
  getSession,
  clearSession,
  markVerified,
  isPhoneVerified,
  clearVerification,
} from '../utils/otpStore.js';

export async function sendOtp(req, res, next) {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber || !/^\+?[1-9]\d{6,14}$/.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Valid phone number with country code is required (e.g., +919876543210).',
      });
    }

    const sessionId = await send2FactorOtp(phoneNumber);
    setSession(phoneNumber, sessionId);

    res.json({ success: true, message: 'OTP sent to your phone.' });
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

    const sessionId = getSession(phoneNumber);
    if (!sessionId) {
      return res.status(400).json({ verified: false, error: 'OTP expired. Please request a new one.' });
    }

    const verified = await verify2FactorOtp(sessionId, otp);

    if (!verified) {
      return res.status(400).json({ verified: false, error: 'Invalid or expired OTP.' });
    }

    clearSession(phoneNumber);
    markVerified(phoneNumber);

    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
}

export { isPhoneVerified, clearVerification };
