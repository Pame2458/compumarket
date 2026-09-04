
import { Router } from 'express';
import { carritosController } from '../controllers/index.js';
import { verificarCliente } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/items', verificarCliente, carritosController.agregarItem);
router.delete('/items/:id', verificarCliente, carritosController.removerItem);

export default router;
