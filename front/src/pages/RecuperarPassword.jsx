/// src/pages/RecuperarPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordCliente } from '../services/authService.js'; 
import logo from '../img/logo.jpg';

function RecuperarPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!email) {
            setError('Por favor ingresá tu correo electrónico.');
            return;
        }

        try {
            setEnviando(true);
            
            // 🌟 Invocamos el servicio limpiando espacios en blanco accidentales
            const data = await forgotPasswordCliente(email.trim());

            if (data.estado) {
                setMensajeExito('Se envió un correo de recuperación. Revisá tu bandeja de entrada.');
                setEmail('');
            }
        } catch (err) {
            console.error('Error en recuperación:', err);
            // 🌟 Capturamos el mensaje que devuelve Axios desde el backend de forma segura
            const mensajeError = err.response?.data?.mensaje || 'Hubo un problema. Intentá nuevamente.';
            setError(mensajeError);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 pt-4">
            <div className="text-center flex flex-col items-center">
                <img 
                    src={logo}
                    alt="Logo compuMarket" 
                    className="h-14 w-auto mb-3 object-contain"
                />
                <div className="w-20 h-20 bg-slate-900/5 rounded-full flex items-center justify-center p-3 mb-2 border border-slate-200">
                    <svg className="w-12 h-12 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Recuperar Contraseña
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Ingresá tu correo para enviarte un enlace de acceso
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

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Asociado</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                        placeholder="usuario@tecnico.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wider mt-2"
                >
                    {enviando ? 'Enviando...' : 'Enviar Enlace de Recuperación →'}
                </button>
            </form>

            <p className="text-center text-xs text-slate-500 font-medium">
                ¿Te acordaste?{' '}
                <Link to="/login" className="font-bold text-red-600 hover:underline">
                    Volver al Login
                </Link>
            </p>
        </div>
    );
}

export default RecuperarPassword;