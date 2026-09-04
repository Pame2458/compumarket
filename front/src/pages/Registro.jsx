// Registro.jsx - Página de registro para nuevos clientes.

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Registro() {
    const navigate = useNavigate();
    const { registro } = useAuth();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!nombre || !email || !password) {
            setError('Por favor completá los campos obligatorios (Nombre, Email y Contraseña).');
            return;
        }

        try {
            setEnviando(true);
            await registro({ nombre, apellido, email, password });
            navigate('/');
        } catch (err) {
            console.error('Error al registrar cliente:', err);
            setError(err.message || 'Error al registrar la cuenta. Intentá nuevamente.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="mx-auto max-w-md space-y-6 pt-2">
            {/* Encabezado con la identidad de compuMarket */}
            <div className="text-center">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Crear Cuenta</h1>
                <p className="mt-1 text-xs text-slate-500 font-medium">
                    Únete a la comunidad líder en hardware de alto rendimiento.
                </p>
            </div>

            {/* Banner de Errores Estilizado */}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700 animate-fade-in">
                    {error}
                </div>
            )}

            {/* Formulario con botones rojos y enfoque de marca */}
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

                <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 uppercase tracking-wider">Contraseña *</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Aviso de Términos y Condiciones Visuales */}
                <p className="text-[11px] text-slate-500 leading-normal pt-1">
                    Al hacer clic en el botón de abajo, aceptas los <span className="text-red-600 font-bold hover:underline cursor-pointer">Términos de Servicio</span> y las políticas de privacidad de la tienda.
                </p>

                {/* Botón de Registro en Color Rojo */}
                <button
                    type="submit"
                    disabled={enviando}
                    className="w-full rounded-xl bg-red-600 py-3 text-center text-sm font-bold text-white transition hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm uppercase tracking-wider mt-2"
                >
                    {enviando ? 'Creando cuenta...' : 'Crear Cuenta →'}
                </button>
            </form>

            {/* Enlace alternativo para retornar al login */}
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
