// AuthContext.jsx - Provee el estado global de autenticación para compuMarket.
// Resuelve la persistencia e integridad de sesiones libre de renders en cascada.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCliente, registrarCliente, refreshTokenCliente } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Inicialización síncrona precisa (Lazy Initialization)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [usuario, setUsuario] = useState(() => {
    const userGuardado = localStorage.getItem('usuario');
    return userGuardado ? JSON.parse(userGuardado) : null;
  });
  
  // Nivel Senior: Si hay datos en LocalStorage, la interfaz nace autenticada de inmediato.
  // Esto elimina la necesidad de inicializar un estado "cargando" artificial en el efecto.
  const [cargando, setCargando] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    setCargando(false);
  }, []);

  // Función lógica pura de actualización de estados locales
  const sincronizarSesionLocal = useCallback((nuevoToken, clienteDatos) => {
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(clienteDatos));
    setToken(nuevoToken);
    setUsuario(clienteDatos);
  }, []);

  // Hilo secundario asíncrono para verificar la validez del token en segundo plano (Background Fetch)
  useEffect(() => {
    if (!token) return;

    let active = true;

    // Ejecutamos la petición HTTP de fondo para validar contra MySQL mediante Express
    refreshTokenCliente()
      .then((respuesta) => {
        if (active && respuesta && respuesta.token) {
          sincronizarSesionLocal(respuesta.token, respuesta.cliente);
        }
      })
      .catch((error) => {
        console.warn('Verificación de sesión de fondo rechazada:', error.message);
        if (active) logout();
      });

    return () => {
      active = false;
    };
  }, [token, logout, sincronizarSesionLocal]);

  // Iniciar sesión comercial
  const login = async (email, password) => {
    setCargando(true);
    try {
      const respuesta = await loginCliente(email, password);
      sincronizarSesionLocal(respuesta.token, respuesta.cliente);
      return respuesta.cliente;
    } finally {
      setCargando(false);
    }
  };

  // Registro de cuentas del DER
  const registro = async (datos) => {
    setCargando(true);
    try {
      const respuesta = await registrarCliente(datos);
      sincronizarSesionLocal(respuesta.token, respuesta.cliente);
      return respuesta.cliente;
    } finally {
      setCargando(false);
    }
  };

  const actualizarUsuario = (datosActualizados) => {
    const usuarioNuevo = { ...usuario, ...datosActualizados };
    localStorage.setItem('usuario', JSON.stringify(usuarioNuevo));
    setUsuario(usuarioNuevo);
  };

  const value = {
    usuario,
    token,
    isAuthenticated: !!usuario,
    cargando,
    login,
    registro,
    logout,
    actualizarUsuario,
  };

  return (
    <AuthContext.Provider value={value}>
      {cargando ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">
          Procesando transaccionalidad de cuenta...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
// ... (Todo el código anterior del AuthProvider permanece exactamente igual)

/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}


