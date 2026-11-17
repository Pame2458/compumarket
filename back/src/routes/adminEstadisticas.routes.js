import { Router } from 'express';
import { verificarAdmin } from '../middlewares/auth.middleware.js';
import { obtenerEstadisticas } from '../controllers/adminEstadisticas.controller.js';

const router = Router();

// Cambiamos verificarPanel por verificarAdmin para excluir al rol operador
router.get('/', verificarAdmin, obtenerEstadisticas);

export default router;