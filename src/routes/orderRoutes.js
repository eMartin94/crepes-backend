// orderRoutes.js
import { Router } from 'express';
import {
  crearOrden,
  listarOrdenes,
  listarTodasLasOrdenes,
  actualizarEstadoOrden,
  // Otros controladores relacionados con órdenes
} from '../controllers/orderController.js';
import { verificarTokenYAdmin, verificarTokenYBuscarCarrito } from '../middlewares/validateToken.js';
import validarRol from '../middlewares/checkRole.js';

const router = Router();

router.get('/orders', verificarTokenYBuscarCarrito, listarOrdenes);
router.post('/orders', verificarTokenYBuscarCarrito, crearOrden);
router.get('/orders/all', verificarTokenYBuscarCarrito, validarRol(["administrator", "seller"]), listarTodasLasOrdenes);
router.patch('/orders/:orderId', verificarTokenYBuscarCarrito, actualizarEstadoOrden);

export default router;
