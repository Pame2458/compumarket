import { Router } from 'express';
import { verificarAdmin } from '../middlewares/auth.middleware.js';
import { listarPedidos, actualizarEstadoPedido } from '../controllers/adminPedidos.controller.js';

const router = Router();

router.get('/', verificarAdmin, listarPedidos);
router.put('/:id/estado', verificarAdmin, actualizarEstadoPedido);

export default router;