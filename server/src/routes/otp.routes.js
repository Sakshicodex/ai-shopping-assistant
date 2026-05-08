import { Router } from 'express';
import { sendOtp, verifyOtp } from '../controllers/otp.controller.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/send', otpLimiter, sendOtp);
router.post('/verify', verifyOtp);

export default router;
