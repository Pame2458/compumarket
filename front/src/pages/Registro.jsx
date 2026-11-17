// Registro.jsx - Página de registro para nuevos clientes.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../components/assets/log.png';


const labelClase =
    'block text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors group-focus-within:text-red-400';
const inputClase =
    'w-full rounded-[10px] border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_16px_rgba(239,68,68,0.45)]';
const cardClase =
    'rounded-2xl border border-red-500/40 bg-slate-950 p-6 shadow-[0_18px_45px_rgba(2,6,23,0.7),0_0_25px_rgba(220,38,38,0.15)] transition-all duration-300 hover:border-red-500/75 hover:shadow-[0_22px_55px_rgba(2,6,23,0.85),0_0_32px_rgba(239,68,68,0.28)]';
const botonClase =
    'group relative w-full overflow-hidden rounded-xl border border-red-500 bg-gradient-to-r from-red-600 to-red-700 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_16px_rgba(220,38,38,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

// Logo con pulso luminoso neón
function LogoNeon() {
    return (
        <div className="group relative mb-3 h-20 w-20 transition-transform duration-300 hover:scale-105">
            <div className="absolute inset-0 animate-pulse rounded-full shadow-[0_0_28px_rgba(239,68,68,0.75)]" />
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-red-500/50 bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] p-2">
                <img src={logo} alt="Logo compuMarket" className="h-full w-full rounded-full object-contain" />
            </div>
        </div>
    );
}

function Registro() {
    const { registro } = useAuth();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [registrado, setRegistrado] = useState(false);

    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Validaciones en tiempo real para la contraseña
    const validaciones = {
        longitud: password.length >= 10,
        mayuscula: /[A-Z]/.test(password),
        numero: /[0-9]/.test(password),
        simbolo: /[^A-Za-z0-9]/.test(password),
    };

    const esPasswordValido = Object.values(validaciones).every(Boolean);

    const requisitos = [
        { ok: validaciones.longitud, texto: 'Mínimo 10 caracteres' },
        { ok: validaciones.mayuscula, texto: 'Al menos una mayúscula' },
        { ok: validaciones.numero, texto: 'Al menos un número' },
        { ok: validaciones.simbolo, texto: 'Al menos un símbolo o especial' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!nombre || !email || !password) {
            setError('Por favor completá los campos obligatorios (Nombre, Email y Contraseña).');
            return;
        }

        if (!esPasswordValido) {
            setError('La contraseña no cumple con los requisitos de seguridad mínimos.');
            return;
        }

        try {
            setEnviando(true);

            await registro({ nombre, apellido, email, password });

            // Ya no se inicia sesión: el cliente debe verificar su correo primero
            setRegistrado(true);
        } catch (err) {
            console.error('Error al registrar cliente:', err);
            setError(err.message || 'Error al registrar la cuenta. Intentá nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    const animacion = `transition-all duration-700 ease-out ${
        visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-6 scale-[0.97] opacity-0 blur-sm'
    }`;

    // Pantalla de confirmación luego del registro
    if (registrado) {
        return (
            <div className={`mx-auto max-w-md space-y-6 px-4 pt-6 ${animacion}`}>
                <div className="flex flex-col items-center text-center">
                    <LogoNeon />
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">¡Revisá tu correo!</h1>
                </div>

                <div className={`${cardClase} space-y-3 text-center`}>
                    <p className="text-sm text-slate-200">
                        Te enviamos un enlace de verificación a{' '}
                        <span className="font-bold text-white">{email}</span>.
                    </p>
                    <p className="text-xs text-slate-400">
                        El enlace vence en 15 minutos. Si no lo ves, revisá la carpeta de spam.
                    </p>
                    <Link to="/login" className={`${botonClase} mt-2 inline-block`}>
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className="relative">Ir a iniciar sesión</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`mx-auto max-w-md space-y-6 px-4 pt-6 ${animacion}`}>
            {/* Encabezado con la identidad de compuMarket */}
            <div className="flex flex-col items-center text-center">
                <LogoNeon />
                <span className="mb-1 inline-block rounded-full border border-red-100 bg-red-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-600">
                    Registro Clientes
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">Crear Cuenta</h1>
                <p className="mt-1 text-xs font-medium text-slate-500">
                    Únete a la comunidad líder en hardware de alto rendimiento.
                </p>
            </div>

            {/* Alerta de error */}
            {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/60 bg-red-900/45 p-3.5 text-xs font-semibold text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
                    <span className="h-2 w-2 shrink-0 animate-ping rounded-full bg-red-500" />
                    <span className="flex-1">{error}</span>
                    <button
                        type="button"
                        onClick={() => setError('')}
                        className="px-1 text-sm font-bold text-red-300 transition-colors hover:text-white"
                        aria-label="Cerrar alerta"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Formulario oscuro con borde rojo y brillo al pasar el mouse */}
            <form onSubmit={handleSubmit} className={`${cardClase} space-y-4`}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="group">
                        <label className={`mb-1.5 ${labelClase}`}>Nombre *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className={inputClase}
                            placeholder="Juan"
                            required
                        />
                    </div>
                    <div className="group">
                        <label className={`mb-1.5 ${labelClase}`}>Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className={inputClase}
                            placeholder="Pérez"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className={`mb-1.5 ${labelClase}`}>Email *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClase}
                        placeholder="nombre@ejemplo.com"
                        required
                    />
                </div>

                {/* Contraseña con mostrar/ocultar y requisitos */}
                <div className="group">
                    <label className={`mb-1.5 ${labelClase}`}>Contraseña *</label>
                    <div className="relative">
                        <input
                            type={mostrarPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${inputClase} pr-20`}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 select-none text-xs font-bold text-slate-400 transition-colors hover:text-red-400"
                        >
                            {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>

                    <div className="mt-3 space-y-1.5 rounded-xl border border-slate-800 bg-slate-900 p-3 text-[11px] font-medium">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Requisitos de seguridad:
                        </p>
                        {requisitos.map((r) => (
                            <div key={r.texto} className="flex items-center gap-1.5 transition-colors">
                                <span
                                    className={
                                        r.ok
                                            ? 'font-bold text-emerald-400 [text-shadow:0_0_8px_rgba(52,211,153,0.5)]'
                                            : 'text-slate-500'
                                    }
                                >
                                    {r.ok ? '✓' : '○'} {r.texto}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="pt-1 text-[11px] leading-normal text-slate-400">
                    Al hacer clic en el botón de abajo, aceptas los{' '}
                    <span className="cursor-pointer font-bold text-red-400 transition-colors hover:text-red-300 hover:underline">
                        Términos de Servicio
                    </span>{' '}
                    y las políticas de privacidad de la tienda.
                </p>

                {/* Botón con destello luminoso, elevación y estado de carga */}
                <button type="submit" disabled={enviando} className={`${botonClase} mt-2`}>
                    {/* Reflejo diagonal al pasar el mouse */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    <span className="relative flex items-center justify-center gap-2">
                        {enviando ? (
                            <>
                                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                Crear Cuenta
                                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                            </>
                        )}
                    </span>
                </button>
            </form>

            <p className="text-center text-xs font-medium text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-bold text-red-600 transition-colors hover:text-red-700 hover:underline">
                    Iniciar Sesión
                </Link>
            </p>
        </div>
    );
}

export default Registro;