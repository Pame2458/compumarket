// auth.js contiene funciones reutilizables para manejar contraseñas y tokens.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export const JWT_SECRET_CLIENT = process.env.JWT_SECRET_CLIENT || 'clave_por_defecto_cliente';
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN || 'clave_por_defecto_admin';

/**
 * Encripta una contraseña en texto plano.
 */
export const encriptarPassword = async (password) => {
    return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compara una contraseña en texto plano con un hash guardado.
 */
export const compararPassword = async (password, hash) => {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
};

/**
 * Genera un token JWT con los datos del usuario o cliente.
 */
export const generarToken = (payload, secreto, opciones = {}) => {
    return jwt.sign(payload, secreto, opciones);
};

/**
 * Verifica un token JWT de forma síncrona/asíncrona.
 */
export const verificarToken = (token, secreto) => {
    return jwt.verify(token, secreto);
};
