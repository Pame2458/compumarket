
import { Router } from 'express';
import { marcasController } from '../controllers/index.js';

const router = Router();

router.get('/', marcasController.obtener); // Público para filtros en React
router.post('/', marcasController.crear); 
export default router;
