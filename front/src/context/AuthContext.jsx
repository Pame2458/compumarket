// AuthContext.jsx - Provee el estado global de autenticación para compuMarket.

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginCliente, registrarCliente, refreshTokenCliente } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : null;
  });

  const [usuario, setUsuario] = useState(() => {
    try {
      const userGuardado = localStorage.getItem('usuario');
      if (!userGuardado || userGuardado === 'undefined') return null;
      return JSON.parse(userGuardado);
    } catch {
      return null;
    }
  });

  const [cargando, setCargando] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setToken(null);
    setUsuario(null);
    setCargando(false);
  }, []);

  const sincronizarSesionLocal = useCallback((nuevoToken, clienteDatos) => {
    localStorage.setItem('token', nuevoToken);
    localStorage.setItem('usuario', JSON.stringify(clienteDatos));
    setToken(nuevoToken);
    setUsuario(clienteDatos);
  }, []);

  useEffect(() => {
    if (!token) return;

    let active = true;

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

  // Registro: NO inicia sesión. El cliente debe verificar su correo primero.
  const registro = async (datos) => {
    setCargando(true);
    try {
      const respuesta = await registrarCliente(datos);
      return respuesta;
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* eslint-disable-next-line react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  return context;
}