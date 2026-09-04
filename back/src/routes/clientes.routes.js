

import { Router } from 'express';
import { clientesController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verificarAdmin, clientesController.obtener);
router.post('/', clientesController.crear); // Registro público de la tienda

export default router;
