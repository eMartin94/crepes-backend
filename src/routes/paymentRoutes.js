// paymentRoutes.js
import { Router } from 'express';
import { createSessionStripe } from '../controllers/paymentController.js';
import { authRequired, verifyTokenAndFindCart } from '../middlewares/validateToken.js';

const router = Router();

router.post('/payment/create-intent', verifyTokenAndFindCart, createSessionStripe);

export default router;
