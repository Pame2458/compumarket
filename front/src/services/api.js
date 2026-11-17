// src/services/adminApi.js
import axios from 'axios';

// Si tu backend corre en el puerto 3000 o 5000, colocá la URL completa 
// o verificá que el proxy de Vite en vite.config.js redirija correctamente '/api'.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones: Inyecta el token de admin
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('tokenAdmin') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de Respuestas
adminApi.interceptors.response.use(
  (response) => {
    // Retorna directamente los datos
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.mensaje || error.response?.data?.message || error.message;
    console.error('[ADMIN] Error en la petición:', message);
    return Promise.reject(new Error(message));
  }
);

export default adminApi;