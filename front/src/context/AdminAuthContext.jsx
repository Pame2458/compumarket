// AdminAuthContext.jsx - Contexto de autenticación exclusivo del panel de administración.
//
// ¿Qué es un contexto en React?
// Un contexto permite compartir datos (en este caso, la sesión del admin) entre
// componentes sin tener que pasar props manualmente por cada nivel del árbol.
//
// ¿Por qué un contexto separado del cliente?
// El contexto de cliente maneja el token y datos del cliente. El contexto de admin
// maneja el token y datos del admin. Esto evita que un token de cliente pueda usarse
// en rutas de admin y viceversa, manteniendo ambas zonas completamente aisladas.
//
// Estructura del archivo:
// 1. AdminAuthProvider: componente que envuelve las rutas de admin y provee el estado.
// 2. useAdminAuth: hook para acceder al contexto desde cualquier componente hijo.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    loginAdmin as loginAdminService,
    refreshTokenAdmin,
} from '../services/adminService.js';

// Creamos el contexto. El valor por defecto es null hasta que se provea.
const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    // logout: elimina el token y los datos del admin del localStorage
    // y limpia el estado. Se usa useCallback para que la función no se
    // recree en cada render y evitar bucles de efectos.
    const logout = useCallback(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsuario');
        setToken(null);
        setAdmin(null);
    }, []);

    // validarToken: se ejecuta al montar el provider. Si existe un token
    // guardado, consulta al backend para validarlo y obtener uno nuevo.
    // De este modo la sesión persiste al recargar la página.
    const validarToken = useCallback(async () => {
        const tokenGuardado = localStorage.getItem('adminToken');

        if (!tokenGuardado) {
            setCargando(false);
            return false;
        }

        try {
            const respuesta = await refreshTokenAdmin();
            const nuevoToken = respuesta.token;
            const usuarioActualizado = respuesta.usuario;

            localStorage.setItem('adminToken', nuevoToken);
            localStorage.setItem('adminUsuario', JSON.stringify(usuarioActualizado));

            setToken(nuevoToken);
            setAdmin(usuarioActualizado);
            return true;
        } catch (error) {
            console.warn('El token de admin no es válido o ha expirado:', error.message);
            logout();
            return false;
        } finally {
            setCargando(false);
        }
    }, [logout]);

    // Efecto que dispara la validación del token cuando el componente se monta.
    // validarToken está envuelto en useCallback para poder incluirlo como
    // dependencia sin causar renders infinitos.
    useEffect(() => {
        validarToken();
    }, [validarToken]);

    // login: envía email y password al backend. Si son correctos, guarda
    // el nuevo token y los datos del admin en localStorage y en el estado.
    const login = async (email, password) => {
        const respuesta = await loginAdminService(email, password);
        // respuesta = { estado: true, token, usuario: { id, nombre, email, rol, rolId } }
        const nuevoToken = respuesta.token;
        const nuevoAdmin = respuesta.usuario;

        localStorage.setItem('adminToken', nuevoToken);
        localStorage.setItem('adminUsuario', JSON.stringify(nuevoAdmin));

        setToken(nuevoToken);
        setAdmin(nuevoAdmin);

        return nuevoAdmin;
    };

    // Actualiza datos del admin en el contexto y localStorage
    const actualizarAdmin = (datos) => {
        const adminActualizado = { ...admin, ...datos };
        localStorage.setItem('adminUsuario', JSON.stringify(adminActualizado));
        setAdmin(adminActualizado);
    };

    // Helpers de rol: se derivan del admin logueado y simplifican la lógica
    // condicional en los componentes. Si el rol es 'ADMIN', puede escribir.
   const esAdmin = admin?.rol?.nombre?.toUpperCase() === 'ADMINISTRADOR';
const esOperador = admin?.rol?.nombre?.toUpperCase() === 'OPERADOR';
    const puedeEscribir = esAdmin;

    const value = {
        admin,
        token,
        isAuthenticated: !!admin,
        cargando,
        login,
        logout,
        actualizarAdmin,
        validarToken,
        esAdmin,
        esOperador,
        puedeEscribir,
        rol: admin?.rol?.nombre|| null,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {cargando ? (
                <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">
                    <p className="text-sm font-medium">Verificando sesión de administrador...</p>
                </div>
            ) : (
                children
            )}
        </AdminAuthContext.Provider>
    );
}

// useAdminAuth: hook que devuelve el contexto. Lanza un error si se usa
// fuera del AdminAuthProvider, ayudando a detectar errores de configuración.
export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
    }
    return context;
}
