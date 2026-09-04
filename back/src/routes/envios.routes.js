

import { Router } from 'express';
import { enviosController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/pedido/:idPedido', enviosController.obtenerPorPedido);
router.put('/pedido/:idPedido', verificarAdmin, enviosController.actualizarEstado);

export default router;
