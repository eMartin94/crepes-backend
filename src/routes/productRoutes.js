import { Router } from 'express';
import {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productController.js'
import { authRequired } from '../middlewares/validateToken.js';
import validarRol from '../middlewares/checkRole.js';
import { validarSchema } from '../middlewares/validatorMiddleware.js';
import { productoSchema } from '../schemas/productSchema.js';
import { fileUploadMiddleware } from '../middlewares/fileUpload.js';
import fileUpload from "express-fileupload";

const router = Router();

router.get('/product', listarProductos);
router.get('/product/:id', obtenerProducto);

// Ruta accesible solo para administradores
router.post('/product', authRequired, validarRol(['administrator']), fileUploadMiddleware, crearProducto);
router.patch('/product/:id', authRequired, validarRol(['administrator']), fileUploadMiddleware, actualizarProducto);
router.delete('/product/:id', authRequired, validarRol(['administrator']), eliminarProducto);


export default router;
