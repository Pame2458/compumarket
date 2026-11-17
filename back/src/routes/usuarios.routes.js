
import { Router } from 'express';
import { usuariosController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas son exclusivas para administradores
router.get('/', verificarAdmin, usuariosController.obtener);
router.post('/', verificarAdmin, usuariosController.crear);
router.put('/:id', verificarAdmin, usuariosController.actualizar);
router.delete('/:id', verificarAdmin, usuariosController.eliminar);

export default router;
