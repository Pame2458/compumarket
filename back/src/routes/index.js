import { Router } from 'express';
import authRoutes from './auth.routes.js';
import rolesRoutes from './roles.routes.js';
import usuariosRoutes from './usuarios.routes.js';
import clientesRoutes from './clientes.routes.js';
import domiciliosRoutes from './domicilios.routes.js';
import marcasRoutes from './marcas.routes.js';
import categoriasRoutes from './categorias.routes.js';
import productosRoutes from './productos.routes.js';
import calificacionesRoutes from './calificaciones.routes.js';
import carritosRoutes from './carritos.routes.js';
import pedidosRoutes from './pedidos.routes.js';
import enviosRoutes from './envios.routes.js';
import pagosRoutes from './pagos.routes.js';

const router = Router();

// Módulo de accesos
router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/usuarios', usuariosRoutes);
router.use('/clientes', clientesRoutes);
router.use('/domicilios', domiciliosRoutes);

// Módulo de catálogo
router.use('/marcas', marcasRoutes);
router.use('/categorias', categoriasRoutes);
router.use('/productos', productosRoutes);
router.use('/calificaciones', calificacionesRoutes);

// Módulo transaccional
router.use('/carritos', carritosRoutes);
router.use('/pedidos', pedidosRoutes);
router.use('/envios', enviosRoutes);
router.use('/pagos', pagosRoutes);

export default router;

