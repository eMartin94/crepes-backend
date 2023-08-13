import { Router } from 'express';
import {
  createOrder,
  listOrder,
  listAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { verifyTokenAndAdmin, verifyTokenAndFindCart } from '../middlewares/validateToken.js';
import validateRole from '../middlewares/checkRole.js';

const router = Router();

router.get('/orders', verifyTokenAndFindCart, listOrder);
router.post('/orders', verifyTokenAndFindCart, createOrder);
router.get(
  '/orders/all',
  verifyTokenAndFindCart,
  validateRole(['administrator', 'seller']),
  listAllOrders
);
router.patch('/orders/:orderId', verifyTokenAndFindCart, updateOrderStatus);

export default router;
