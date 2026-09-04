import { Router } from 'express';
import { pedidosController } from '../controllers/index.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/checkout', verificarCliente, pedidosController.procesarCheckout);

export default router;


