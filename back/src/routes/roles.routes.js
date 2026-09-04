
import { Router } from 'express';
import { rolesController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verificarAdmin, rolesController.obtener);
router.post('/', verificarAdmin, rolesController.crear);

export default router;
