
import { Router } from 'express';
import { marcasController } from '../controllers/index.js';

const router = Router();

router.get('/', marcasController.obtener); 
router.post('/', marcasController.crear); 
export default router;
router.put('/:id', marcasController.actualizar);
router.delete('/:id', marcasController.eliminar);