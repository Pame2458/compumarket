import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [recordarme, setRecordarme] = useState(false);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

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

    // Estilos compartidos por los campos del formulario
    const labelClase =
        'block text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors group-focus-within:text-red-400';
    const inputClase =
        'w-full rounded-[10px] border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_16px_rgba(239,68,68,0.45)]';

    return (
        <div
            className={`mx-auto max-w-md space-y-6 px-4 pt-6 transition-all duration-700 ease-out ${
                visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-6 scale-[0.97] opacity-0 blur-sm'
            }`}
        >
            {/* Header del Login con Identidad Visual */}
            <div className="flex flex-col items-center text-center">
                {/* Logo con pulso luminoso neón */}
                <div className="group relative mb-3 h-20 w-20 transition-transform duration-300 hover:scale-105">
                    <div className="absolute inset-0 animate-pulse rounded-full shadow-[0_0_28px_rgba(239,68,68,0.75)]" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-red-500/50 bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] p-3">
                        <svg
                            className="h-11 w-11 text-slate-200 transition-all duration-300 group-hover:rotate-6 group-hover:text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6m-6 3h6" />
                        </svg>
                    </div>
                </div>

                <span className="mb-1 inline-block rounded-full border border-red-100 bg-red-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-600">
                    Ingreso Clientes
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Bienvenido de nuevo</h1>
                <p className="mt-1 text-xs font-medium text-slate-500">
                    Accedé a tu cuenta de alto rendimiento en compuMarket
                </p>
            </div>

            {/* Alerta de error */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/60 bg-red-900/45 p-3.5 text-xs font-semibold text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                    <span className="h-2 w-2 shrink-0 animate-ping rounded-full bg-red-500" />
                    <span>{error}</span>
                </div>
            )}

            {/* Formulario oscuro con borde rojo y brillo al pasar el mouse */}
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-red-500/40 bg-slate-950 p-6 shadow-[0_18px_45px_rgba(2,6,23,0.7),0_0_25px_rgba(220,38,38,0.15)] transition-all duration-300 hover:border-red-500/75 hover:shadow-[0_22px_55px_rgba(2,6,23,0.85),0_0_32px_rgba(239,68,68,0.28)]"
            >
                <div className="group">
                    <label className={`mb-1.5 ${labelClase}`}>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClase}
                        placeholder="usuario@tecnico.com"
                        required
                    />
                </div>

                <div className="group">
                    <div className="mb-1.5 flex items-center justify-between">
                        <label className={labelClase}>Contraseña</label>
                        <Link
                            to="/recuperar"
                            className="text-xs font-semibold text-red-400 transition-colors hover:text-red-300 hover:underline"
                        >
                            Olvidé mi contraseña
                        </Link>
                    </div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClase}
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Casillero Recordarme */}
                <div className="flex items-center pt-1">
                    <input
                        id="recordarme"
                        type="checkbox"
                        checked={recordarme}
                        onChange={(e) => setRecordarme(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-slate-700 bg-slate-900 text-red-600 focus:ring-red-500"
                    />
                    <label
                        htmlFor="recordarme"
                        className="ml-2 block cursor-pointer select-none text-xs font-medium text-slate-300 transition-colors hover:text-white"
                    >
                        Recordarme
                    </label>
                </div>

                {/* Botón con destello luminoso, elevación y estado de carga */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="group relative mt-2 w-full overflow-hidden rounded-xl border border-red-500 bg-gradient-to-r from-red-600 to-red-700 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(220,38,38,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                    {/* Reflejo diagonal al pasar el mouse */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex items-center justify-center gap-2">
                        {enviando ? (
                            <>
                                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                Iniciar Sesión
                                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                            </>
                        )}
                    </span>
                </button>
            </form>

            <p className="text-center text-xs font-medium text-slate-500">
                ¿No tienes una cuenta?{' '}
                <Link to="/registro" className="font-bold text-red-600 transition-colors hover:text-red-700 hover:underline">
                    Regístrate
                </Link>
            </p>
        </div>
    );
}

export default Login;