//authService.js - Maneja las peticiones de autenticación utilizando la instancia de Axios.
import api from './api.js';

// POST /auth/cliente/login -> Inicia sesión como cliente.
export const loginCliente = async (email, password) => {
    // Al usar la instancia unificada de tu api.js, el interceptor ya te devuelve response.data
    const respuesta = await api.post('/auth/cliente/login', { email, password });
    return respuesta; 
};

// POST /auth/cliente/registro -> Registra un nuevo cliente (Mapea las variables de tu tabla Cliente).
export const registrarCliente = async ({ nombre, apellido, email, password }) => {
    const respuesta = await api.post('/auth/cliente/registro', { nombre, apellido, email, password });
    return respuesta;
};

// 🔒 LA SOLUCIÓN CRÍTICA: Añadimos la exportación requerida por el AuthContext.jsx
// GET /auth/cliente/refresh -> Valida el token actual y devuelve un token renovado de MySQL.
export const refreshTokenCliente = async () => {
    const respuesta = await api.get('/auth/cliente/refresh');
    return respuesta;
};

// GET /auth/cliente/perfil -> Obtiene los datos completos del perfil del cliente (Usa JWT).
export const obtenerPerfilCliente = async () => {
    const respuesta = await api.get('/auth/cliente/perfil');
    return respuesta;
};

// PUT /auth/cliente/perfil -> Actualiza los datos del cliente logueado en MySQL.
export const actualizarPerfilCliente = async (datos) => {
    const respuesta = await api.put('/auth/cliente/perfil', datos);
    return respuesta;
};
// 📩 1. POST /auth/cliente/forgot-password -> Solicita enlace enviando el correo electrónico
export const forgotPasswordCliente = async (email) => {
    const respuesta = await api.post('/auth/cliente/forgot-password', { email });
    return respuesta;
};

// 🔒 2. POST /auth/cliente/reset-password -> Envía el token y la nueva contraseña para impactar en MySQL
export const restablecerPasswordCliente = async (token, nuevaContraseña) => {
    const respuesta = await api.post('/auth/cliente/reset-password', { token, password:nuevaContraseña });
    return respuesta;
};