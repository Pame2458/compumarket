// pedidosService.js - Peticiones relacionadas a los pedidos del cliente.
import api from './api.js';

// GET /pedidos/mis-pedidos -> Pedidos del cliente logueado, con sus productos y estado.
export const obtenerMisPedidos = async () => {
    const respuesta = await api.get('/pedidos/mis-pedidos');
    return respuesta;
};