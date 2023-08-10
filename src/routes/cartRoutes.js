// cartRoutes.js
import { Router } from 'express';
import { listarCarrito, listarCarritos, agregarCarrito, eliminarCarrito, actualizarCantidadCarrito } from '../controllers/cartController.js';
import { verificarTokenYBuscarCarrito, verificarTokenYAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.get('/cart', verificarTokenYBuscarCarrito, listarCarrito);
router.get('/carts', verificarTokenYAdmin, listarCarritos);
router.post('/cart', verificarTokenYBuscarCarrito, agregarCarrito);
router.delete('/cart/:productId', verificarTokenYBuscarCarrito, eliminarCarrito);
router.patch('/cart/:productId', verificarTokenYBuscarCarrito, actualizarCantidadCarrito);

export default router;
