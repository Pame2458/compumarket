import jwt from 'jsonwebtoken';
import { JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Usuario from '../models/usuarios.model.js';
import Cliente from '../models/clientes.model.js';
import Rol from '../models/roles.model.js';

export const verificarToken = (secret) => (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                estado: false,
                mensaje: 'No se proporcionó un token de autenticación',
            });
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({
            estado: false,
            mensaje: 'Token inválido o expirado',
            error: error.message,
        });
    }
};

export const verificarCliente = (req, res, next) => {
    verificarToken(JWT_SECRET_CLIENT)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'cliente') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para clientes',
                });
            }

            const cliente = await Cliente.findByPk(req.user.id);

            if (!cliente) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Cliente no encontrado',
                });
            }

            req.cliente = cliente;
            next();
        } catch (error) {
            console.error('Error en verificarCliente:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar cliente',
                error: error.message,
            });
        }
    });
};

export const verificarAdmin = (req, res, next) => {
    verificarToken(JWT_SECRET_ADMIN)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'admin') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para administradores',
                });
            }

            const usuario = await Usuario.findByPk(req.user.id, {
                include: {
                    model: Rol,
                    as: 'rol',
                },
            });

            if (!usuario || !usuario.rol) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }

            if (usuario.rol.nombre.toLowerCase() !== 'administrador') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'El usuario no tiene permisos de administrador',
                });
            }

            req.usuario = usuario;
            next();
        } catch (error) {
            console.error('Error en verificarAdmin:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar administrador',
                error: error.message,
            });
        }
    });
};

export const verificarOperadorOAdmin = (req, res, next) => {
    verificarToken(JWT_SECRET_ADMIN)(req, res, async (err) => {
        if (err) return next(err);

        try {
            if (!req.user || req.user.tipo !== 'admin') {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Acceso solo para el equipo de gestión',
                });
            }

            const usuario = await Usuario.findByPk(req.user.id, {
                include: { model: Rol, as: 'rol' },
            });

            if (!usuario || !usuario.rol) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'Usuario o rol no encontrado',
                });
            }

            const rolesPermitidos = ['administrador', 'operador'];

            if (!rolesPermitidos.includes(usuario.rol.nombre.toLowerCase())) {
                return res.status(403).json({
                    estado: false,
                    mensaje: 'No tenés permisos para esta acción',
                });
            }

            req.usuario = usuario;
            next();
        } catch (error) {
            console.error('Error en verificarOperadorOAdmin:', error);
            return res.status(500).json({
                estado: false,
                mensaje: 'Error al verificar usuario',
                error: error.message,
            });
        }
    });
};

export const verificarPanel = verificarOperadorOAdmin;

// Middleware exclusivo para la ruta de refresh del admin.
// A diferencia de verificarAdmin, acepta tokens expirados:
// solo verifica que la firma sea auténtica y que el usuario exista en la DB.
// Así un admin puede renovar su sesión aunque el token ya haya vencido.
export const verificarAdminParaRefresh = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ estado: false, mensaje: 'No se proporcionó un token.' });
        }

        const token = authHeader.split(' ')[1];

        // Verificamos la firma con el secreto de admin pero ignoramos la expiración.
        // Si la firma es inválida (token de cliente, token manipulado), jwt.verify
        // lanza un error que NO es TokenExpiredError y lo rechazamos igual.
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET_ADMIN, { ignoreExpiration: true });
        } catch (error) {
            return res.status(401).json({ estado: false, mensaje: 'Token inválido.' });
        }

        if (!decoded?.id || decoded.tipo !== 'admin') {
            return res.status(401).json({ estado: false, mensaje: 'Token no corresponde a un administrador.' });
        }

        const usuario = await Usuario.findByPk(decoded.id, {
            include: { model: Rol, as: 'rol' },
        });

        if (!usuario || !usuario.rol) {
            return res.status(401).json({ estado: false, mensaje: 'Usuario no encontrado.' });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error('Error en verificarAdminParaRefresh:', error);
        return res.status(500).json({ estado: false, mensaje: 'Error al verificar el token.' });
    }
};