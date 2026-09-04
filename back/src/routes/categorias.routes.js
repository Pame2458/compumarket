import { Router } from 'express';
import { categoriasController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', categoriasController.obtener); // Público para menú de navegación
router.get('/:id', categoriasController.obtenerPorId);
router.post('/', verificarAdmin, categoriasController.crear);
router.put('/:id', verificarAdmin, categoriasController.actualizar);
router.delete('/:id', verificarAdmin, categoriasController.eliminar);

export default router;