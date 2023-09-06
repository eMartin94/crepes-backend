import { Router } from 'express';
import {
  listCategory,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { authRequired } from '../middlewares/validateToken.js';
import validateRole from '../middlewares/checkRole.js';

const router = Router();

router.get('/category', listCategory);
router.get('/category/:id', getCategoryById);

// Ruta accesible solo para administradores
router.post(
  '/category',
  authRequired,
  validateRole(['administrator']),
  createCategory
);
router.patch(
  '/category/:id',
  authRequired,
  validateRole(['administrator']),
  updateCategory
);
router.delete(
  '/category/:id',
  authRequired,
  validateRole(['administrator']),
  deleteCategory
);

export default router;
