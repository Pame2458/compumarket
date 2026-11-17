import { Router } from 'express';
import { calificacionesController } from '../controllers/index.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/mis-resenas', verificarCliente, calificacionesController.obtenerMisResenas); // NUEVA
router.get('/producto/:idProducto', calificacionesController.obtenerPorProducto);
router.post('/', verificarCliente, calificacionesController.crear); // Requiere login público

export default router;