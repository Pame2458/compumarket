import { Router } from 'express';
import { pedidosController } from '../controllers/index.js';
import { obtenerMisPedidos } from '../controllers/pedidos.controller.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/checkout', verificarCliente, pedidosController.procesarCheckout);
router.get('/mis-pedidos', verificarCliente, obtenerMisPedidos);

export default router;


