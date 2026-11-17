
// clientes.admin.routes.js - Rutas exclusivas para el administrador.
import { Router } from 'express';
import {
    listarClientes,
    listarPedidosDeCliente
} from '../controllers/clientes.admin.controller.js';

import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas exclusivas para administradores
router.get('/', verificarAdmin, listarClientes);
router.get('/:id/pedidos', verificarAdmin, listarPedidosDeCliente);

export default router;
