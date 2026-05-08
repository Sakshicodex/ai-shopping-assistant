import { Router } from 'express';
import { initiateCallback, serveTwiml } from '../controllers/callback.controller.js';

const router = Router();

router.post('/initiate', initiateCallback);
router.post('/twiml', serveTwiml);

export default router;
