import { Router } from 'express';
import {
  listCart,
  listAllCarts,
  addToCart,
  removeFromCart,
  updateItemQuantity,
} from '../controllers/cartController.js';
import {
  verifyTokenAndFindCart,
  verifyTokenAndAdmin,
} from '../middlewares/validateToken.js';

const router = Router();

router.get('/cart', verifyTokenAndFindCart, listCart);
router.post('/cart', verifyTokenAndFindCart, addToCart);
router.delete('/cart/:productId', verifyTokenAndFindCart, removeFromCart);
router.patch('/cart/:productId', verifyTokenAndFindCart, updateItemQuantity);
// Ruta accesible solo para administradores
router.get('/carts', verifyTokenAndAdmin, listAllCarts);

export default router;
