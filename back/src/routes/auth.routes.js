import { Router } from 'express';
import { 
    loginCliente, 
    registrarCliente, 
    loginAdmin, 
    refreshTokenCliente, 
    obtenerPerfilCliente,
    actualizarPerfilCliente,
    forgotPassword,
    resetPassword,
    verificarEmail,
    cambiarPassword,
    refreshTokenAdmin,
    obtenerPerfilAdmin,
} from '../controllers/auth.controller.js';
import { verificarCliente, verificarAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoints Públicos de Acceso y Alta
router.post('/cliente/login', loginCliente);
router.post('/cliente/registro', registrarCliente);
router.post('/admin/login', loginAdmin);

// 📩 Verificación de correo
router.post('/cliente/verificar-email', verificarEmail);

// 🔒 Endpoints Públicos de Recuperación de Contraseña
router.post('/cliente/forgot-password', forgotPassword);
router.post('/cliente/reset-password', resetPassword);

// Endpoints de Sesión y Perfil Sincronizados con el AuthContext de React
router.get('/cliente/refresh', verificarCliente, refreshTokenCliente);
router.get('/cliente/perfil', verificarCliente, obtenerPerfilCliente);
router.put('/cliente/perfil', verificarCliente, actualizarPerfilCliente);
router.put('/cliente/password', verificarCliente, cambiarPassword);
router.get('/admin/refresh', verificarAdmin, refreshTokenAdmin);
router.get('/admin/perfil', verificarAdmin, obtenerPerfilAdmin);

export default router;