import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let recaptchaVerifier = null;
let confirmationResult = null;

export function setupRecaptcha(elementId) {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
  }
  recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {},
  });
  return recaptchaVerifier;
}

export async function sendOtp(phoneNumber) {
  if (!recaptchaVerifier) {
    throw new Error('Recaptcha not initialized');
  }
  confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  return true;
}

export async function verifyOtp(otp) {
  if (!confirmationResult) {
    throw new Error('No OTP was sent');
  }
  const result = await confirmationResult.confirm(otp);
  return !!result.user;
}
