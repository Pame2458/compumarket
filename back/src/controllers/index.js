// Importamos las funciones de cada controlador individual del sistema
import * as authController from './auth.controller.js';
import * as rolesController from './roles.controller.js';
import * as usuariosController from './usuarios.controller.js';
import * as clientesController from './clientes.controller.js';
import * as domiciliosController from './domicilios.controller.js';
import * as marcasController from './marcas.controller.js';
import * as categoriasController from './categorias.controller.js';
import * as productosController from './productos.controller.js';
import * as calificacionesController from './calificaciones.controller.js';
import * as carritosController from './carritos.controller.js';
import * as pedidosController from './pedidos.controller.js';
import * as enviosController from './envios.controller.js';
import * as pagosController from './pagos.controller.js';

// Exportamos un objeto unificado que expone todo el comportamiento del backend
export {
    authController,
    rolesController,
    usuariosController,
    clientesController,
    domiciliosController,
    marcasController,
    categoriasController,
    productosController,
    calificacionesController,
    carritosController,
    pedidosController,
    enviosController,
    pagosController
};
