// LoginAdmin.jsx - Página de inicio de sesión para administradores.
//
// Esta pantalla es la única ruta pública dentro del área /admin.
// Recolecta email y password, los envía al backend a través del contexto
// AdminAuthContext y, si son correctos, redirige al panel (/admin).

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';

function LoginAdmin() {
    const navigate = useNavigate();
    const { login } = useAdminAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // handleSubmit: evita el envío por defecto del formulario, valida que
    // haya datos, llama al login del contexto y redirige al panel si funciona.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Completá email y contraseña.');
            return;
        }

        try {
            setEnviando(true);
            // login viene de AdminAuthContext y hace la petición al backend.
            const admin = await login(email, password);
            console.log('Login admin exitoso:', admin);
            navigate('/admin');
        } catch (err) {
            console.error('Error al iniciar sesión como admin:', err);
            setError(err.message || 'Credenciales inválidas.');
        } finally {
            setEnviando(false);
        }
    };

    // Estilos compartidos por los campos del formulario
    const labelClase = 'mb-1.5 block text-sm font-bold text-slate-300';
    const inputClase =
        'w-full rounded-[10px] border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_16px_rgba(239,68,68,0.45)]';

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#01040f] bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.14)_0%,transparent_60%)] px-4">
            <div
                className={`w-full max-w-md space-y-6 rounded-2xl border border-red-500/45 bg-slate-950 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(220,38,38,0.18)] transition-all duration-700 ease-out hover:border-red-500/80 hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(239,68,68,0.3)] ${
                    visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-6 scale-[0.97] opacity-0 blur-sm'
                }`}
            >
                <div className="text-center">
                    {/* Insignia de Zona Restringida */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/50 bg-amber-500/[.12] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-amber-400">
                        ⚡ Zona restringida
                    </span>
                    <h1 className="mt-3 text-3xl font-bold text-white">Ingreso de administradores</h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Acceso exclusivo para el equipo de gestión.
                    </p>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-500/60 bg-red-900/45 p-4 text-sm font-medium text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelClase}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClase}
                            placeholder="admin@integrado.test"
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClase}>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClase}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full cursor-pointer rounded-xl border border-red-500 bg-red-600 px-4 py-[11px] font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                        {enviando ? 'Ingresando...' : 'Ingresar al panel'}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500">
                    <a href="/" className="text-red-400 transition-colors hover:text-red-300">
                        Volver al sitio público
                    </a>
                </p>
            </div>
        </div>
    );
}

export default LoginAdmin;