import { Router } from 'express';
import {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from '../controllers/categoryController.js';
import { authRequired } from '../middlewares/validateToken.js';
import validarRol from '../middlewares/checkRole.js';

const router = Router();

router.get('/category', listarCategorias);
router.get('/category/:id', obtenerCategoria);
router.post('/category', authRequired, validarRol(['administrator']), crearCategoria);
router.patch('/category/:id', authRequired, validarRol(['administrator']), actualizarCategoria);
router.delete('/category/:id', authRequired, validarRol(['administrator']), eliminarCategoria);

export default router;