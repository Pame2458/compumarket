
import { Router } from 'express';
import { domiciliosController } from '../controllers/index.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/cliente/:idCliente', verificarCliente, domiciliosController.obtenerPorCliente);
router.post('/', verificarCliente, domiciliosController.crear);

export default router;
