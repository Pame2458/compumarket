// adminService.js centraliza las llamadas al backend del panel de administración.
//
// Cada función exportada representa una operación contra la API.
// Usa adminApi, que automáticamente inyecta el token de admin en cada request.
// Esto mantiene la sesión de admin aislada de la sesión de cliente.

import { adminApi } from './adminApi.js';

// Configuración para requests con archivos (multipart). Sin esto, si adminApi
// fija "application/json" por defecto, axios convierte el FormData a JSON
// y las imágenes nunca llegan al backend.
const multipart = { headers: { 'Content-Type': 'multipart/form-data' } };

// POST /auth/admin/login -> Inicia sesión como administrador.
// Recibe email y password del formulario y devuelve token + datos del usuario.
export const loginAdmin = async (email, password) => {
    return adminApi.post('/auth/admin/login', { email, password });
};

// GET /auth/admin/refresh -> Valida el token actual y devuelve uno renovado.
// Se usa al recargar la página para mantener la sesión activa.
export const refreshTokenAdmin = async () => {
    return adminApi.get('/auth/admin/refresh');
};

// GET /auth/admin/perfil -> Obtiene el perfil del administrador logueado.
export const obtenerPerfilAdmin = async () => {
    return adminApi.get('/auth/admin/perfil');
};

// CRUD de administradores bajo /admin.
// Los endpoints POST, PUT y DELETE están protegidos en el backend para rol ADMIN.
// listarAdministradores recibe un objeto de parámetros (pagina, limite,
// ordenarPor, direccion, busqueda, rolId) y lo pasa como query string.
export const listarAdministradores = async (params = {}) => adminApi.get('/usuarios', { params });
export const obtenerAdministradorPorId = async (id) => adminApi.get(`/usuarios/${id}`);
export const crearAdministrador = async (datos) => adminApi.post('/usuarios', datos);
export const actualizarAdministrador = async (id, datos) => adminApi.put(`/usuarios/${id}`, datos);
export const eliminarAdministrador = async (id) => adminApi.delete(`/usuarios/${id}`);
export const listarRolesAdmin = async () => adminApi.get('/roles');

// --- CRUD de Categorías (protegido, admin) ---
export const listarCategoriasAdmin = async () => adminApi.get('/categorias');
export const crearCategoria = async (datos) => adminApi.post('/categorias', datos);
export const actualizarCategoria = async (id, datos) => adminApi.put(`/categorias/${id}`, datos);
export const eliminarCategoria = async (id) => adminApi.delete(`/categorias/${id}`);

// --- CRUD de Productos (protegido, admin) ---
// listarProductosAdmin recibe un objeto de parámetros (pagina, limite,
// ordenarPor, direccion, busqueda, idCategoria, idMarca) y lo pasa como
// query string a axios mediante { params }.
export const listarProductosAdmin = async (params = {}) => adminApi.get('/productos/admin/todos', { params });

// crearProducto y actualizarProducto reciben un FormData (con las imágenes),
// por eso usan la configuración multipart.
export const crearProducto = async (datos) => adminApi.post('/productos', datos, multipart);
export const actualizarProducto = async (id, datos) => adminApi.put(`/productos/${id}`, datos, multipart);
export const eliminarProducto = async (id) => adminApi.delete(`/productos/${id}`);

// --- CRUD de Marcas (protegido, admin) ---
// También se usa para el select de marcas del formulario de Productos.
export const listarMarcasAdmin = async () => adminApi.get('/marcas');
export const crearMarca = async (datos) => adminApi.post('/marcas', datos);
export const actualizarMarca = async (id, datos) => adminApi.put(`/marcas/${id}`, datos);
export const eliminarMarca = async (id) => adminApi.delete(`/marcas/${id}`);

// Usada por el formulario de Productos para crear una marca rápida.
export const crearMarcaAdmin = async (nombre) => adminApi.post('/marcas', { nombre });