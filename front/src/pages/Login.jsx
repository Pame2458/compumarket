import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recordarme, setRecordarme] = useState(false); // Estado agregado según el wireframe original
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor completá todos los campos.');
            return;
        }

        try {
            setEnviando(true);
            await login(email, password, recordarme);
            navigate('/');
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.message || 'Error al iniciar sesión. Verificá tus credenciales.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 pt-4">
            {/* Header del Login con Identidad Visual del Circuito */}
            <div className="text-center flex flex-col items-center">
                {/* Contenedor del Logo de Circuitos e-Commerce */}
                <div className="w-20 h-20 bg-slate-900/5 rounded-full flex items-center justify-center p-3 mb-2 border border-slate-200">
                    <svg className="w-12 h-12 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 3h6" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    Bienvenido de nuevo
                </h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Accedé a tu cuenta de alto rendimiento en compuMarket
                </p>
            </div>

            {/* Alertas de error estilizadas */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-fade-in">
                    {error}
                </div>
            )}

            {/* Formulario Estilo Wireframe */}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                        placeholder="usuario@tecnico.com"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Contraseña</label>
                        <Link to="/recuperar" className="text-xs font-semibold text-red-600 hover:underline">
                            Olvidé mi contraseña
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Casillero Recordarme (Mapeado del Wireframe Oficial) */}
                <div className="flex items-center">
                    <input
                        id="recordarme"
                        type="checkbox"
                        checked={recordarme}
                        onChange={(e) => setRecordarme(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <label htmlFor="recordarme" className="ml-2 block text-xs text-slate-600 font-medium cursor-pointer select-none">
                        Recordarme
                    </label>
                </div>

                {/* Botón de envío rojo corporativo */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wider mt-2"
                >
                    {enviando ? 'Iniciando sesión...' : 'Iniciar Sesión →'}
                </button>
            </form>

            <p className="text-center text-xs text-slate-500 font-medium">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="font-bold text-red-600 hover:underline">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}

export default Login;

