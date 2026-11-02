//checkoutService.js
// src/services/checkoutService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; 

/**
 * Confirma el pedido transformando el carrito activo en una orden firme en MySQL.
 * @param {Object} datosEnvio - Opcional. Contiene el idDomicilio si el usuario seleccionó envío.
 */
export const postConfirmarPedido = async (datosEnvio = {}) => {
    // Tomamos el token almacenado del cliente autenticado
    const token = localStorage.getItem('token'); 
    
    // Enviamos la petición POST al backend adjuntando el token en las cabeceras
    const response = await axios.post(
        `${API_URL}/confirmar-pedido`, 
        datosEnvio, // Enviamos el cuerpo vacío {} o con el idDomicilio si se requiere
        { 
            headers: { 
                Authorization: `Bearer ${token}` 
            } 
        }
    );
    return response.data;
};
