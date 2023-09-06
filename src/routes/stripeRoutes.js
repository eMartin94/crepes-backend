import express, { Router } from 'express';
import { verifyTokenAndFindCart } from '../middlewares/validateToken.js';
import { createSession, webhook } from '../controllers/stripeController.js';

const router = Router();

router.post('/stripe/create-session', verifyTokenAndFindCart, createSession);
router.post(
  '/stripe/webhook',
  express.raw({ type: 'application/json' }),
  webhook
);

export default router;
