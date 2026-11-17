import { Router } from 'express';
import { verificarPanel } from '../middlewares/auth.middleware.js';
import { listarPedidos, actualizarEstadoPedido } from '../controllers/adminPedidos.controller.js';

const router = Router();

router.get('/', verificarPanel, listarPedidos);
router.put('/:id/estado', verificarPanel, actualizarEstadoPedido);

export default router;