


import { Router } from 'express';
import { productosController } from '../controllers/index.js';
import { verificarAdmin } from '../middlewares/auth.middleware.js';
import { uploadProductos } from '../middlewares/upload.js';

const router = Router();

// Rutas públicas
router.get('/', productosController.obtener);

// Rutas de admin. Esta va antes de '/:id' para que "admin" no se confunda con un id.
router.get('/admin/todos', verificarAdmin, productosController.obtenerTodosAdmin);

router.get('/:id', productosController.obtenerPorId);

// "imagenes" es el nombre del campo que manda el front (máx. 5 archivos).
// uploadProductos va después de verificarAdmin, así solo un admin puede subir archivos.
router.post('/', verificarAdmin, uploadProductos.array('imagenes', 5), productosController.crear);
router.put('/:id', verificarAdmin, uploadProductos.array('imagenes', 5), productosController.actualizar);

router.delete('/:id', verificarAdmin, productosController.eliminar); // Borrado lógico

export default router;