import { Router } from 'express';
import { initiateCallback } from '../controllers/callback.controller.js';

const router = Router();

router.post('/initiate', initiateCallback);

export default router;
