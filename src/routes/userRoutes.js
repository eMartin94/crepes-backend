import { Router } from 'express';
import {
  updateUserRole,
  createUser,
  listUsers,
  getUserById,
} from '../controllers/userController.js';
import { verifyTokenAndAdmin } from '../middlewares/validateToken.js';

const router = Router();

// Ruta accesible solo para administradores
router.get('/user', verifyTokenAndAdmin, listUsers);
router.get('/user/:userId', verifyTokenAndAdmin, getUserById);
router.post('/user', verifyTokenAndAdmin, createUser);
router.patch('/user/:userId', verifyTokenAndAdmin, updateUserRole);

export default router;
