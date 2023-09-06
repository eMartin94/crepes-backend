import { Router } from 'express';
import {
  listProducts,
  listAvailableProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authRequired } from '../middlewares/validateToken.js';
import validateRole from '../middlewares/checkRole.js';
import { fileUploadMiddleware } from '../middlewares/fileUpload.js';

const router = Router();

router.get('/product', listProducts);
router.get('/product-available', listAvailableProducts);
router.get('/product/:id', getProductById);

// Ruta accesible solo para administradores
router.post(
  '/product',
  authRequired,
  validateRole(['administrator']),
  fileUploadMiddleware,
  createProduct
);
router.patch(
  '/product/:id',
  authRequired,
  validateRole(['administrator']),
  fileUploadMiddleware,
  updateProduct
);
router.delete(
  '/product/:id',
  authRequired,
  validateRole(['administrator']),
  deleteProduct
);

export default router;
