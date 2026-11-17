import { Router } from 'express';
import { verificarPanel } from '../middlewares/auth.middleware.js';
import { listarCalificaciones, moderarCalificacion } from '../controllers/adminCalificaciones.controller.js';

const router = Router();

router.get('/', verificarPanel, listarCalificaciones);
router.put('/:id/moderar', verificarPanel, moderarCalificacion);

export default router;