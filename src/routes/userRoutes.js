import { Router } from 'express';
import { actualizarRolUsuario, crearUsuario, listarUsuarios, obtenerUsuario } from '../controllers/userController.js';
import { verificarTokenYAdmin } from '../middlewares/validateToken.js';

const router = Router();

router.get('/user', verificarTokenYAdmin, listarUsuarios);
router.get('/user/:userId', verificarTokenYAdmin, obtenerUsuario);
router.post('/user', verificarTokenYAdmin, crearUsuario);
router.patch('/user/:userId', verificarTokenYAdmin, actualizarRolUsuario);

export default router;