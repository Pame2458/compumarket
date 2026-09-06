// src/pages/RestablecerPassword.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { restablecerPasswordCliente } from '../services/authService.js';
import logo from '../img/logo.jpg';


function RestablecerPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Captura el parámetro ?token= de la URL

    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarNueva, setMostrarNueva] = useState(false);
    const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

    const validaciones = {
    longitud: nuevaContraseña.length >= 10,
    mayuscula: /[A-Z]/.test(nuevaContraseña),
    numero: /[0-9]/.test(nuevaContraseña),
    simbolo: /[^A-Za-z0-9]/.test(nuevaContraseña)
};

const esPasswordValido = Object.values(validaciones).every(Boolean);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!token) {
            setError('El enlace de recuperación es inválido o no contiene un token válido.');
            return;
        }

        // NUEVA VALIDACIÓN COMPLETA
if (!esPasswordValido) {
    setError('La contraseña no cumple con los requisitos de seguridad mínimos.');
    return;
}

if (nuevaContraseña !== confirmarContraseña) {
    setError('Las contraseñas ingresadas no coinciden.');
    return;
}


        if (nuevaContraseña !== confirmarContraseña) {
            setError('Las contraseñas ingresadas no coinciden.');
            return;
        }

        try {
            setEnviando(true);
            
            // Invocamos el servicio que conecta con Axios hacia la API
            const data = await restablecerPasswordCliente(token, nuevaContraseña);

            if (data.estado) {
                setMensajeExito('Contraseña actualizada correctamente. Redirigiendo al login...');
                
                // Redirección automatizada tras 3 segundos de éxito
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (err) {
            console.error('Error al restablecer contraseña:', err);
            const mensajeError = err.response?.data?.mensaje || 'Hubo un error al cambiar la contraseña. Intentá nuevamente.';
            setError(mensajeError);
        } finally {
            setEnviando(false);
        }
    };
    return (
        <div className="mx-auto max-w-md space-y-6 pt-4">
            {/* Encabezado con el Logo de tu proyecto */}
            <div className="text-center flex flex-col items-center justify-center">
                <img 
                    src={logo}
                    alt="Logo compuMarket" 
                    className="h-14 w-auto mb-3 object-contain"
                />
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Nueva Contraseña
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Establecé tus nuevas credenciales de acceso para compuMarket
                </p>
            </div>

            {/* Mensajes de Alertas */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-fade-in">
                    {error}
                </div>
            )}

            {mensajeExito && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-3.5 text-xs font-semibold text-green-700 animate-fade-in">
                    {mensajeExito}
                </div>
            )}

            {!token ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800 text-center">
                    El enlace utilizado no es válido. Por favor, solicitá uno nuevo.
                    <Link to="/recuperar" className="block mt-2 font-bold text-red-600 hover:underline">Solicitar nuevo enlace</Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    {/* Nueva Contraseña con Mostrar/Ocultar e indicadores */}
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Nueva Contraseña</label>
                        <div className="relative">
                            <input
                                type={mostrarNueva ? "text" : "password"}
                                value={nuevaContraseña}
                                onChange={(e) => setNuevaContraseña(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 pl-3 pr-16 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarNueva(!mostrarNueva)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold select-none"
                            >
                                {mostrarNueva ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>

                        {/* Lista dinámica de requisitos (Cambia a verde si se cumple) */}
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-[11px] font-medium">
                            <p className="font-bold text-slate-400 uppercase tracking-wider mb-1 text-[10px]">Requisitos de seguridad:</p>
                            
                            <div className="flex items-center gap-1.5 transition-colors">
                                <span className={validaciones.longitud ? "text-green-600 font-bold" : "text-slate-400"}>
                                    {validaciones.longitud ? "✓" : "○"} Mínimo 10 caracteres
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 transition-colors">
                                <span className={validaciones.mayuscula ? "text-green-600 font-bold" : "text-slate-400"}>
                                    {validaciones.mayuscula ? "✓" : "○"} Al menos una mayúscula
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 transition-colors">
                                <span className={validaciones.numero ? "text-green-600 font-bold" : "text-slate-400"}>
                                    {validaciones.numero ? "✓" : "○"} Al menos un número
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 transition-colors">
                                <span className={validaciones.simbolo ? "text-green-600 font-bold" : "text-slate-400"}>
                                    {validaciones.simbolo ? "✓" : "○"} Al menos un símbolo o especial
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Confirmar Contraseña con Mostrar/Ocultar */}
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Confirmar Contraseña</label>
                        <div className="relative">
                            <input
                                type={mostrarConfirmar ? "text" : "password"}
                                value={confirmarContraseña}
                                onChange={(e) => setConfirmarContraseña(e.target.value)}
                                className="w-full rounded-lg border border-slate-300 pl-3 pr-16 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold select-none"
                            >
                                {mostrarConfirmar ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    {/* Botón de Envíos */}
                    <button
                        type="submit"
                        disabled={enviando || mensajeExito}
                        className="w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wider mt-2"
                    >
                        {enviando ? 'Procesando cambio...' : 'Confirmar Cambio →'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default RestablecerPassword;