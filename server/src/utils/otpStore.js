const sessions = new Map();
const verifiedPhones = new Map();

const SESSION_TTL_MS = 5 * 60 * 1000;
const VERIFICATION_TTL_MS = 10 * 60 * 1000;

export function setSession(phoneNumber, sessionId) {
  sessions.set(phoneNumber, { sessionId, expiresAt: Date.now() + SESSION_TTL_MS });
}

export function getSession(phoneNumber) {
  const entry = sessions.get(phoneNumber);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    sessions.delete(phoneNumber);
    return null;
  }
  return entry.sessionId;
}

export function clearSession(phoneNumber) {
  sessions.delete(phoneNumber);
}

export function markVerified(phoneNumber) {
  verifiedPhones.set(phoneNumber, Date.now() + VERIFICATION_TTL_MS);
}

export function isPhoneVerified(phoneNumber) {
  const expiresAt = verifiedPhones.get(phoneNumber);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    verifiedPhones.delete(phoneNumber);
    return false;
  }
  return true;
}

export function clearVerification(phoneNumber) {
  verifiedPhones.delete(phoneNumber);
}
