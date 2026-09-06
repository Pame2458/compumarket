import { compararPassword, generarToken, verificarToken, JWT_SECRET_CLIENT, JWT_SECRET_ADMIN } from '../utils/auth.js';
import Cliente from '../models/clientes.model.js';
import Usuario from '../models/usuarios.model.js';
import { emisorDeCorreo } from '../config/configuracionCorreo.js';


// 🔑 LOGIN CLIENTE
export const loginCliente = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ estado: false, mensaje: 'Debe proporcionar email y password' });
        }

        const cliente = await Cliente.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!cliente) {
            return res.status(401).json({ estado: false, mensaje: 'Credenciales inválidas' });
        }

        const passwordValido = await compararPassword(password, cliente.contraseña || cliente.password);
        if (!passwordValido) {
            return res.status(401).json({ estado: false, mensaje: 'Credenciales inválidas' });
        }

        const token = generarToken({ id: cliente.id, email: cliente.email, tipo: 'cliente' }, JWT_SECRET_CLIENT);

        const clienteSanitizado = cliente.toJSON();
        delete clienteSanitizado.contraseña;
        delete clienteSanitizado.password;

        res.json({
            estado: true,
            mensaje: 'Login de cliente exitoso',
            token,
            cliente: clienteSanitizado
        });
    } catch (error) {
        console.error('Error en loginCliente:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

// 💎 REGISTRO CLIENTE MEJORADO
export const registrarCliente = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        if (!nombre?.trim() || !apellido?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ 
                estado: false, 
                mensaje: 'Debe proporcionar nombre, apellido, email y password sin espacios vacíos.' 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ estado: false, mensaje: 'El formato del email ingresado no es válido.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ estado: false, mensaje: 'La contraseña debe contener al menos 6 caracteres.' });
        }

        const emailNormalizado = email.toLowerCase().trim();

        const existe = await Cliente.findOne({ where: { email: emailNormalizado } });
        if (existe) {
            return res.status(409).json({ estado: false, mensaje: 'El email ya se encuentra registrado.' });
        }

        const cliente = await Cliente.create({ 
            nombre: nombre.trim(), 
            apellido: apellido.trim(), 
            email: emailNormalizado, 
            contraseña: password, 
            password: password 
        });

        const token = generarToken({ id: cliente.id, email: cliente.email, tipo: 'cliente' }, JWT_SECRET_CLIENT);

        const clienteSanitizado = cliente.toJSON();
        delete clienteSanitizado.contraseña;
        delete clienteSanitizado.password;

        res.status(201).json({
            estado: true,
            mensaje: 'Registro de cliente exitoso',
            token,
            cliente: clienteSanitizado
        });
    } catch (error) {
        console.error('Error en registrarCliente:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al registrar cliente', error: error.message });
    }
};

// 🔄 REFRESH TOKEN CLIENTE
export const refreshTokenCliente = async (req, res) => {
    try {
        const cliente = req.cliente; 
        if (!cliente) return res.status(401).json({ estado: false, mensaje: 'No autenticado' });

        const nuevoToken = generarToken({ id: cliente.id, email: cliente.email, tipo: 'cliente' }, JWT_SECRET_CLIENT);

        const clienteSanitizado = cliente.toJSON();
        delete clienteSanitizado.contraseña;
        delete clienteSanitizado.password;

        res.json({ estado: true, token: nuevoToken, cliente: clienteSanitizado });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

// 👤 OBTENER PERFIL CLIENTE
export const obtenerPerfilCliente = async (req, res) => {
    if (!req.cliente) return res.status(401).json({ estado: false, mensaje: 'No autorizado' });
    const clienteSanitizado = req.cliente.toJSON();
    delete clienteSanitizado.contraseña;
    delete clienteSanitizado.password;
    res.json({ estado: true, cliente: clienteSanitizado });
};

// 🔑 LOGIN ADMIN
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ estado: false, mensaje: 'Debe proporcionar email y password' });
        }

        const usuario = await Usuario.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!usuario) {
            return res.status(401).json({ estado: false, mensaje: 'Credenciales inválidas' });
        }

        const passwordValido = await compararPassword(password, usuario.contraseña || usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ estado: false, mensaje: 'Credenciales inválidas' });
        }

        const token = generarToken({ id: usuario.id, email: usuario.email, tipo: 'admin' }, JWT_SECRET_ADMIN);

        const usuarioSanitizado = usuario.toJSON();
        delete usuarioSanitizado.contraseña;
        delete usuarioSanitizado.password;

        res.json({
            estado: true,
            mensaje: 'Login de administrador exitoso',
            token,
            usuario: usuarioSanitizado
        });
    } catch (error) {
        console.error('Error en loginAdmin:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al iniciar sesión', error: error.message });
    }
};
// 🔄 REFRESH TOKEN ADMIN
export const refreshTokenAdmin = async (req, res) => {
    try {
        const usuario = req.usuario; // seteado por el middleware verificarAdmin
        if (!usuario) return res.status(401).json({ estado: false, mensaje: 'No autenticado' });

        const nuevoToken = generarToken({ id: usuario.id, email: usuario.email, tipo: 'admin' }, JWT_SECRET_ADMIN);

        const usuarioSanitizado = usuario.toJSON();
        delete usuarioSanitizado.contraseña;
        delete usuarioSanitizado.password;

        res.json({ estado: true, token: nuevoToken, usuario: usuarioSanitizado });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

// 👤 OBTENER PERFIL ADMIN
export const obtenerPerfilAdmin = async (req, res) => {
    if (!req.usuario) return res.status(401).json({ estado: false, mensaje: 'No autorizado' });
    const usuarioSanitizado = req.usuario.toJSON();
    delete usuarioSanitizado.contraseña;
    delete usuarioSanitizado.password;
    res.json({ estado: true, usuario: usuarioSanitizado });
};
// 📩 1. SOLICITAR ENLACE DE RECUPERACIÓN
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ estado: false, mensaje: 'El email es requerido.' });
        }
        const emailNormalizado = email.toLowerCase().trim();
        const cliente = await Cliente.findOne({ where: { email: emailNormalizado } });
        
        // Criterio de seguridad: No revelar si el correo existe o no en la Base de Datos
        if (!cliente) {
            return res.json({ 
                estado: true, 
                mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos.' 
            });
        }

        // Generamos un token que expira en 15 minutos exactos
        const tokenRecuperacion = generarToken(
            { id: cliente.id, tipo: 'recuperacion' }, 
            JWT_SECRET_CLIENT, 
            { expiresIn: '15m' }
        );

        
        const enlaceRecuperacion = `http://localhost:5173/restablecer-password?token=${tokenRecuperacion}`;
        // 🌟 CAMBIO: Envío real utilizando Nodemailer
        await emisorDeCorreo.sendMail({
            from: `"Soporte compuMarket 🛒" <${process.env.CORREO_EMISOR}>`,
            to: cliente.email,
            subject: "Recuperá tu contraseña - compuMarket",
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #dc2626; font-weight: 900; margin-bottom: 5px;">compuMarket</h2>
                    <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">Restablecimiento de Contraseña</h3>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        Hola, ${cliente.nombre}. Recibimos una solicitud para cambiar la contraseña de acceso a tu cuenta en nuestra comunidad de hardware de alto rendimiento.
                    </p>
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="${enlaceRecuperacion}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block; text-transform: uppercase;">
                            Establecer Nueva Contraseña
                        </a>
                    </div>
                    <p style="color: #94a3b8; font-size: 11px;">
                        Si tú no solicitaste este proceso, puedes ignorar este mensaje con total seguridad.
                    </p>
                </div>
            `
        });
        return res.json({
            estado: true,
            mensaje: 'Si el correo está registrado, recibirás un enlace de recuperación en los próximos minutos.'
        });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ estado: false, mensaje: 'Error interno al procesar la solicitud.' });
    }
};

// 🔒 2. ESTABLECER LA NUEVA CONTRASEÑA EN LA DB (Completado y Reparado)
export const resetPassword = async (req, res) => {
    try {
        const { token, password} = req.body;

        if (!token || !password) {
            return res.status(400).json({ estado: false, mensaje: 'El token y la nueva contraseña son requeridos.' });
        }

        // 🌟 CAMBIO REALIZADO: Validación estricta sincronizada con el Frontend de React
        const expresionPassword = /^(?=.[A-Z])(?=.\d)(?=.*[^A-Za-z0-9]).{10,}$/;
        if (!expresionPassword.test(password)) {
            return res.status(400).json({ 
                estado: false, 
                mensaje: 'La contraseña debe tener mínimo 10 caracteres, al menos 1 mayúscula, 1 número y 1 símbolo.' 
            });
        }

        let decoded;
        try {
            // Validamos que el token sea auténtico y no haya expirado
            decoded = verificarToken(token, JWT_SECRET_CLIENT);
        } catch (jwtError) {
            return res.status(401).json({ estado: false, mensaje: 'El enlace de recuperación ha expirado o es inválido.' });
        }

        if (decoded.tipo !== 'recuperacion') {
            return res.status(400).json({ estado: false, mensaje: 'Acción de token no válida.' });
        }

        const cliente = await Cliente.findByPk(decoded.id);
        if (!cliente) {
            return res.status(404).json({ estado: false, mensaje: 'El usuario ya no existe en el sistema.' });
        }

        // Actualizamos las propiedades. Al guardarlas, el Hook de Sequelize actuará automáticamente
        cliente.contraseña = password;
        cliente.password = password; 
        await cliente.save();

        return res.json({
            estado: true,
            mensaje: 'Contraseña actualizada correctamente. Ya podés iniciar sesión.'
        });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        return res.status(500).json({ estado: false, mensaje: 'Error interno al cambiar la contraseña.' });
    }
};