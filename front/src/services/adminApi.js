import axios from 'axios';

const API_URL = '/api';

export const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de petición: inyecta el token de admin en cada request.
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de respuesta: normaliza la data y maneja errores.
// Si el backend devuelve 401 (token expirado), intenta renovarlo una sola vez.
// Si el refresh funciona, reintenta el request original con el token nuevo.
// Si el refresh falla, limpia la sesión y deja que el router redirija al login.
adminApi.interceptors.response.use(
    (response) => {
        console.log(
            `[ADMIN] Respuesta ${response.config.method?.toUpperCase()} ${response.config.url}:`,
            response.data
        );
        if (response.data && response.data.data !== undefined) {
            return response.data.data;
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Si es un 401 y todavía no reintentamos este request, intentamos el refresh.
        // _retry evita un bucle infinito si el propio refresh devuelve 401.
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const tokenViejo = localStorage.getItem('adminToken');
                if (!tokenViejo) throw new Error('Sin token');

                // Llamamos al refresh directamente con axios para no pasar
                // por este mismo interceptor y evitar bucles.
                const respuesta = await axios.get(`${API_URL}/auth/admin/refresh`, {
                    headers: { Authorization: `Bearer ${tokenViejo}` },
                });

                const nuevoToken = respuesta.data?.token;
                if (!nuevoToken) throw new Error('El refresh no devolvió token');

                // Guardamos el nuevo token y actualizamos el usuario si viene.
                localStorage.setItem('adminToken', nuevoToken);
                if (respuesta.data?.usuario) {
                    localStorage.setItem('adminUsuario', JSON.stringify(respuesta.data.usuario));
                }

                // Reintentamos el request original con el token nuevo.
                originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
                return adminApi(originalRequest);

            } catch (refreshError) {
                // Si el refresh falló, limpiamos la sesión.
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUsuario');
                console.warn('[ADMIN] Sesión expirada. Redirigiendo al login.');
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        const message = error.response?.data?.mensaje || error.response?.data?.error || error.message;
        console.error('[ADMIN] Error en la petición:', message);
        return Promise.reject(new Error(message));
    }
);