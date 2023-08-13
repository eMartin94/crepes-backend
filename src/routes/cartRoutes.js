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
router.get('/carts', verifyTokenAndAdmin, listAllCarts);
router.post('/cart', verifyTokenAndFindCart, addToCart);
router.delete('/cart/:productId', verifyTokenAndFindCart, removeFromCart);
router.patch('/cart/:productId', verifyTokenAndFindCart, updateItemQuantity);

export default router;
