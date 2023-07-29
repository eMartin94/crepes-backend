import { Router } from 'express';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productController.js'

const router = Router();

router.get('/producto', listarProductos);

router.get('/producto/:id', obtenerProducto);

router.post('/producto', crearProducto);

router.patch('/producto/:id', actualizarProducto);

router.delete('/producto/:id', eliminarProducto);


export default router;
