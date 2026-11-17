// Perfil.jsx - Mi Cuenta: datos personales, dirección y cambio de contraseña opcional.

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
    obtenerPerfilCliente,
    actualizarPerfilCliente,
    cambiarPasswordCliente,
} from '../services/authService.js';
import MenuCuenta from '../components/cuenta/MenuCuenta.jsx';

const inputClase =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500';

function Perfil() {
    const { usuario, actualizarUsuario } = useAuth();

    // Datos personales
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');

    // Domicilio
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [piso, setPiso] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [ciudad, setCiudad] = useState('');
    const [codigoPostal, setCodigoPostal] = useState('');

    // Cambio de contraseña (opcional)
    const [mostrarCambioPassword, setMostrarCambioPassword] = useState(false);
    const [passwordActual, setPasswordActual] = useState('');
    const [passwordNueva, setPasswordNueva] = useState('');
    const [guardandoPassword, setGuardandoPassword] = useState(false);
    const [mensajePassword, setMensajePassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState('');
    const [error, setError] = useState('');

    const validaciones = {
        longitud: passwordNueva.length >= 10,
        mayuscula: /[A-Z]/.test(passwordNueva),
        numero: /[0-9]/.test(passwordNueva),
        simbolo: /[^A-Za-z0-9]/.test(passwordNueva),
    };
    const esPasswordValido = Object.values(validaciones).every(Boolean);

    // Cargamos el perfil una sola vez al entrar a la página
    useEffect(() => {
        const cargarPerfil = async () => {
            try {
                setCargandoDatos(true);
                const data = await obtenerPerfilCliente();
                const c = data?.cliente || {};
                const d = data?.domicilio || {};

                setNombre(c.nombre || '');
                setApellido(c.apellido || '');
                setEmail(c.email || '');
                setTelefono(c.telefono || '');

                setCalle(d.calle || '');
                setNumero(d.numero || '');
                setPiso(d.piso || '');
                setDepartamento(d.departamento || '');
                setCiudad(d.ciudad || '');
                setCodigoPostal(d.codigoPostal || '');
            } catch (err) {
                console.error('Error al cargar perfil:', err);
                // Si falla la petición, usamos los datos guardados en el contexto
                if (usuario) {
                    setNombre(usuario.nombre || '');
                    setApellido(usuario.apellido || '');
                    setEmail(usuario.email || '');
                    setTelefono(usuario.telefono || '');
                }
                setError('No se pudieron obtener todos los datos del servidor.');
            } finally {
                setCargandoDatos(false);
            }
        };

        cargarPerfil();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensajeExito('');

        if (!nombre.trim()) {
            setError('El nombre es obligatorio.');
            return;
        }

        try {
            setGuardando(true);
            const respuesta = await actualizarPerfilCliente({
                nombre,
                apellido,
                telefono,
                domicilio: { calle, numero, piso, departamento, ciudad, codigoPostal },
            });

            if (respuesta.cliente) actualizarUsuario(respuesta.cliente);
            setMensajeExito(respuesta.mensaje || '¡Datos actualizados con éxito!');
        } catch (err) {
            console.error('Error al actualizar perfil:', err);
            setError(err.message || 'Ocurrió un error al guardar los cambios.');
        } finally {
            setGuardando(false);
        }
    };

    const handleCambiarPassword = async () => {
        setErrorPassword('');
        setMensajePassword('');

        if (!passwordActual || !passwordNueva) {
            setErrorPassword('Completá la contraseña actual y la nueva.');
            return;
        }
        if (!esPasswordValido) {
            setErrorPassword('La nueva contraseña no cumple con los requisitos de seguridad.');
            return;
        }

        try {
            setGuardandoPassword(true);
            const respuesta = await cambiarPasswordCliente(passwordActual, passwordNueva);
            setMensajePassword(respuesta.mensaje || 'Contraseña actualizada correctamente.');
            setPasswordActual('');
            setPasswordNueva('');
            setMostrarCambioPassword(false);
        } catch (err) {
            console.error('Error al cambiar contraseña:', err);
            setErrorPassword(err.message || 'No se pudo cambiar la contraseña.');
        } finally {
            setGuardandoPassword(false);
        }
    };

    if (cargandoDatos) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando perfil...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <MenuCuenta />

            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-600">Mi Cuenta</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Mis datos</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Consultá y modificá tu información personal, tu dirección y tus datos de contacto.
                </p>
            </div>

            {mensajeExito && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    {mensajeExito}
                </div>
            )}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                {/* Datos personales */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className={inputClase} required />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Apellido</label>
                        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} className={inputClase} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Correo <span className="text-xs font-normal text-slate-500">(el de tu registro)</span>
                        </label>
                        <input type="email" value={email} disabled className={`${inputClase} cursor-not-allowed bg-slate-100 text-slate-500`} />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                        <input
                            type="text"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className={inputClase}
                            placeholder="Ej: 11 1234-5678"
                        />
                    </div>
                </div>

                {/* Dirección */}
                <div className="space-y-4 border-t border-slate-100 pt-4">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Dirección de envío</h2>
                        <p className="text-xs text-slate-500">La vamos a usar en tus pedidos. Piso y departamento son opcionales.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">Calle</label>
                            <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} className={inputClase} placeholder="Av. San Martín" />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Número</label>
                            <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} className={inputClase} placeholder="123" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Piso</label>
                            <input type="text" value={piso} onChange={(e) => setPiso(e.target.value)} className={inputClase} />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Departamento</label>
                            <input type="text" value={departamento} onChange={(e) => setDepartamento(e.target.value)} className={inputClase} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Ciudad</label>
                            <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} className={inputClase} />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Código postal</label>
                            <input type="text" value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)} className={inputClase} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={guardando}
                        className="rounded-xl bg-red-600 px-6 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                        {guardando ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </form>

            {/* Cambio de contraseña (opcional, aparte del formulario principal) */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Contraseña</h2>
                        <p className="text-xs text-slate-500">Es opcional: solo cambiala si querés.</p>
                    </div>
                    {!mostrarCambioPassword && (
                        <button
                            type="button"
                            onClick={() => {
                                setMostrarCambioPassword(true);
                                setMensajePassword('');
                            }}
                            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Cambiar contraseña
                        </button>
                    )}
                </div>

                {mensajePassword && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
                        {mensajePassword}
                    </div>
                )}

                {mostrarCambioPassword && (
                    <div className="space-y-4">
                        {errorPassword && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                                {errorPassword}
                            </div>
                        )}

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña actual</label>
                            <input type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} className={inputClase} />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Nueva contraseña</label>
                            <input type="password" value={passwordNueva} onChange={(e) => setPasswordNueva(e.target.value)} className={inputClase} />
                        </div>

                        <div className="space-y-1 rounded-xl border border-slate-100 bg-slate-50 p-3 text-[11px] font-medium">
                            <p className={validaciones.longitud ? 'font-bold text-green-600' : 'text-slate-400'}>
                                {validaciones.longitud ? '✓' : '○'} Mínimo 10 caracteres
                            </p>
                            <p className={validaciones.mayuscula ? 'font-bold text-green-600' : 'text-slate-400'}>
                                {validaciones.mayuscula ? '✓' : '○'} Al menos una mayúscula
                            </p>
                            <p className={validaciones.numero ? 'font-bold text-green-600' : 'text-slate-400'}>
                                {validaciones.numero ? '✓' : '○'} Al menos un número
                            </p>
                            <p className={validaciones.simbolo ? 'font-bold text-green-600' : 'text-slate-400'}>
                                {validaciones.simbolo ? '✓' : '○'} Al menos un símbolo o especial
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setMostrarCambioPassword(false);
                                    setPasswordActual('');
                                    setPasswordNueva('');
                                    setErrorPassword('');
                                }}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleCambiarPassword}
                                disabled={guardandoPassword}
                                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {guardandoPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Perfil;