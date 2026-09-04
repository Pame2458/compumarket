// src/pages/RestablecerPassword.jsx
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { restablecerPasswordCliente } from '../services/authService.js';

function RestablecerPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token'); // Captura el parámetro ?token= de la URL

    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [confirmarContraseña, setConfirmarContraseña] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!token) {
            setError('El enlace de recuperación es inválido o no contiene un token válido.');
            return;
        }

        if (nuevaContraseña.length < 6) {
            setError('La contraseña debe contener al menos 6 caracteres.');
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
            <div className="text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-900/5 rounded-full flex items-center justify-center p-3 mb-2 border border-slate-200">
                    <svg className="w-12 h-12 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Nueva Contraseña
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Establecé tus nuevas credenciales de acceso para compuMarket
                </p>
            </div>

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
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Nueva Contraseña</label>
                        <input
                            type="password"
                            value={nuevaContraseña}
                            onChange={(e) => setNuevaContraseña(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Confirmar Contraseña</label>
                        <input
                            type="password"
                            value={confirmarContraseña}
                            onChange={(e) => setConfirmarContraseña(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                            placeholder="••••••••"
                            required
                        />
                    </div>

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
