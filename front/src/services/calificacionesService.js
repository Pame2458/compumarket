// calificacionesService.js - Llamadas al backend para las reseñas del cliente logueado.
import api from './api.js';

// GET /calificaciones/mis-resenas -> { porCalificar, calificadas }
export const obtenerMisResenas = async () => {
    const respuesta = await api.get('/calificaciones/mis-resenas');
    return respuesta;
};

// POST /calificaciones -> crea la reseña (puntaje de 1 a 5 y comentario opcional)
export const crearCalificacion = async ({ idProducto, puntaje, comentario }) => {
    const respuesta = await api.post('/calificaciones', { idProducto, puntaje, comentario });
    return respuesta;
};