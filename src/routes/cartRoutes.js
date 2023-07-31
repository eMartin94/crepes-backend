// cartRoutes.js
import { Router } from 'express';
import { listarCarrito, agregarCarrito, eliminarCarrito, actualizarCantidadCarrito } from '../controllers/cartController.js';
import { verificarTokenYBuscarCarrito } from '../middlewares/validateToken.js';

const router = Router();

router.get('/cart', verificarTokenYBuscarCarrito, listarCarrito);
router.post('/cart', verificarTokenYBuscarCarrito, agregarCarrito);
router.delete('/cart/:productId', verificarTokenYBuscarCarrito, eliminarCarrito);
router.patch('/cart/:productId', verificarTokenYBuscarCarrito, actualizarCantidadCarrito);

export default router;
