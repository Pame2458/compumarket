// Registro.jsx - Página de registro para nuevos clientes.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from '../img/logo.jpg';

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

    // Validaciones en tiempo real para la contraseña
    const validaciones = {
        longitud: password.length >= 10,
        mayuscula: /[A-Z]/.test(password),
        numero: /[0-9]/.test(password),
        simbolo: /[^A-Za-z0-9]/.test(password)
    };

    const esPasswordValido = Object.values(validaciones).every(Boolean);

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

    // Pantalla de confirmación luego del registro
    if (registrado) {
        return (
            <div className="mx-auto max-w-md space-y-6 pt-2">
                <div className="text-center flex flex-col items-center justify-center">
                    <img
                        src={logo}
                        alt="Logo compuMarket"
                        className="h-14 w-auto mb-3 object-contain"
                    />
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">¡Revisá tu correo!</h1>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                    <p className="text-sm text-slate-700">
                        Te enviamos un enlace de verificación a{' '}
                        <span className="font-bold text-slate-900">{email}</span>.
                    </p>
                    <p className="text-xs text-slate-500">
                        El enlace vence en 15 minutos. Si no lo ves, revisá la carpeta de spam.
                    </p>
                    <Link
                        to="/login"
                        className="mt-2 inline-block w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-red-700"
                    >
                        Ir a iniciar sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-md space-y-6 pt-2">
            {/* Encabezado con la identidad de compuMarket */}
            <div className="text-center flex flex-col items-center justify-center">
                <img
                    src={logo}
                    alt="Logo compuMarket"
                    className="h-14 w-auto mb-3 object-contain"
                />
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crear Cuenta</h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Únete a la comunidad líder en hardware de alto rendimiento.
                </p>
            </div>

            {/* Banner de Errores Estilizado */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 transition-all duration-300 ease-in-out flex items-center justify-between">
                    <span>⚠️ {error}</span>
                    <button
                        type="button"
                        onClick={() => setError('')}
                        className="text-red-500 hover:text-red-700 font-bold text-sm ml-2 px-1"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Nombre *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                            placeholder="Juan"
                            required
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Apellido</label>
                        <input
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                            placeholder="Pérez"
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Corporativo / Personal *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                        placeholder="nombre@ejemplo.com"
                        required
                    />
                </div>

                {/* Contraseña con mostrar/ocultar y requisitos en verde */}
                <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Contraseña *</label>
                    <div className="relative">
                        <input
                            type={mostrarPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 pl-3 pr-16 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold select-none"
                        >
                            {mostrarPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

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

                <p className="text-[11px] text-slate-500 leading-normal pt-1">
                    Al hacer clic en el botón de abajo, aceptas los <span className="text-red-600 font-bold hover:underline cursor-pointer">Términos de Servicio</span> y las políticas de privacidad de la tienda.
                </p>

                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wider mt-2"
                >
                    {enviando ? 'Creando cuenta...' : 'Crear Cuenta →'}
                </button>
            </form>

            <p className="text-center text-xs text-slate-500 font-medium">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="font-bold text-red-600 hover:underline">
                    Iniciar Sesión
                </Link>
            </p>
        </div>
    );
}

export default Registro;