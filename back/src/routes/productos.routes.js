


import { Router } from 'express';
import { productosController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', productosController.obtener); // ?idMarca=X soportado nativamente
router.get('/:id', productosController.obtenerPorId);
router.post('/', verificarAdmin, productosController.crear);
router.put('/:id', verificarAdmin, productosController.actualizar);
router.delete('/:id', verificarAdmin, productosController.eliminar); // Borrado lógico
router.get('/', productosController.obtener); // Público, solo activos
router.get('/admin/todos', verificarAdmin, productosController.obtenerTodosAdmin); 
router.get('/:id', productosController.obtenerPorId);
router.post('/', verificarAdmin, productosController.crear);
router.put('/:id', verificarAdmin, productosController.actualizar);
router.delete('/:id', verificarAdmin, productosController.eliminar);


export default router;
