import { Router } from 'express';
import { confirmarPedido } from '../controllers/checkout.controller.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint protegido para que solo clientes autenticados puedan comprar
router.post('/confirmar-pedido', verificarCliente, confirmarPedido);

export default router;