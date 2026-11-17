import { Router } from 'express';
import { productosController } from '../controllers/index.js';
import { verificarAdmin, verificarOperadorOAdmin } from '../middlewares/auth.middleware.js';
import { uploadProductos } from '../middlewares/upload.js';

const router = Router();

// Rutas públicas (las usa la tienda para los clientes)
router.get('/', productosController.obtener);

// Listado del panel: operador y admin pueden verlo.
// Va antes de '/:id' para que "admin" no se confunda con un id.
router.get('/admin/todos', verificarOperadorOAdmin, productosController.obtenerTodosAdmin);

router.get('/:id', productosController.obtenerPorId);

// Crear, editar y eliminar: solo admin
router.post('/', verificarAdmin, uploadProductos.array('imagenes', 5), productosController.crear);
router.put('/:id', verificarAdmin, uploadProductos.array('imagenes', 5), productosController.actualizar);

router.delete('/:id', verificarAdmin, productosController.eliminar); // Borrado lógico

export default router;