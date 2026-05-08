const otpMap = new Map();
const verifiedPhones = new Set();

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export function generateOtp(phoneNumber) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Clear any existing OTP for this number
  if (otpMap.has(phoneNumber)) {
    clearTimeout(otpMap.get(phoneNumber).timer);
  }

  const timer = setTimeout(() => {
    otpMap.delete(phoneNumber);
  }, OTP_EXPIRY_MS);

  otpMap.set(phoneNumber, { otp, timer });
  return otp;
}

export function verifyOtp(phoneNumber, otp) {
  const entry = otpMap.get(phoneNumber);
  if (!entry) return false;
  if (entry.otp !== otp) return false;

  // OTP is valid — clean up and mark phone as verified
  clearTimeout(entry.timer);
  otpMap.delete(phoneNumber);
  verifiedPhones.add(phoneNumber);
  return true;
}

export function isPhoneVerified(phoneNumber) {
  return verifiedPhones.has(phoneNumber);
}

export function clearVerification(phoneNumber) {
  verifiedPhones.delete(phoneNumber);
}
