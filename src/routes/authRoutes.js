import { Router } from 'express';
import {
  login,
  register,
  logout,
  profile,
  createAdministrator,
  verifyToken,
} from '../controllers/authController.js';
import { authRequired } from '../middlewares/validateToken.js';
import validateRole from '../middlewares/checkRole.js';
import { validateSchema } from '../middlewares/validatorMiddleware.js';
import { registerSchema, loginSchema } from '../schemas/authSchema.js';

const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verifyToken);
router.get('/profile', authRequired, profile);
router.post('/createAdministrator', validateRole(['administrator']), createAdministrator);

export default router;
