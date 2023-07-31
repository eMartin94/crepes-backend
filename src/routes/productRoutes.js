import { Router } from 'express';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productController.js'
import { authRequired } from '../middlewares/validateToken.js';
import checkRole from '../middlewares/checkRole.js';

const router = Router();

router.get('/product', listarProductos);

router.get('/product/:id', obtenerProducto);

// Ruta accesible solo para administradores
router.post('/product', authRequired, checkRole(['administrator']), crearProducto);

router.patch('/product/:id', authRequired, checkRole(['administrator']), actualizarProducto);

router.delete('/product/:id', authRequired, checkRole(['administrator']), eliminarProducto);


export default router;
