// AdminDashboard.jsx - Página de inicio del panel de administración.
//
// Es la primera pantalla que ve un admin al entrar a /admin.
// Muestra un resumen del usuario logueado, las estadísticas básicas de ventas
// (con filtro por fechas y productos más vendidos), una tarjeta de acceso rápido
// a administradores y un listado visual de permisos según el rol.

import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { Link } from 'react-router-dom';
import { obtenerEstadisticasAdmin } from '../../services/adminService.js';

const formatearPrecio = (valor) =>
    `$${Number(valor || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function AdminDashboard() {
    const { admin, esAdmin, esOperador, puedeEscribir } = useAdminAuth();

    // Estadísticas de ventas
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [estadisticas, setEstadisticas] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // Cada vez que cambia el rango de fechas se vuelven a pedir los datos.
    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError('');
                const params = {};
                if (desde) params.desde = desde;
                if (hasta) params.hasta = hasta;
                const respuesta = await obtenerEstadisticasAdmin(params);
                setEstadisticas(respuesta);
            } catch (err) {
                setEstadisticas(null);
                setError(err.message || 'No se pudieron cargar las estadísticas.');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [desde, hasta]);

    const handleLimpiarFechas = () => {
        setDesde('');
        setHasta('');
    };

    const masVendidos = estadisticas?.masVendidos || [];

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">
                    ¡Hola, {admin?.nombre}!
                </h2>
                <p className="mt-1 text-slate-600">
                    Este es el panel de administración de compuMarket. Desde acá podés gestionar el sistema.
                </p>
                <div className="mt-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700 uppercase">
                   Rol: {admin?.rol?.nombre}
                </div>
            </div>

            {/* ===================================================================
                ESTADÍSTICAS DE VENTAS (HU 6.2 y HU 6.3)
                Solo cuentan los pedidos confirmados: todos menos los cancelados.
                =================================================================== */}
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Estadísticas de ventas</h3>
                        <p className="text-sm text-slate-600">
                            Pedidos confirmados (sin contar los cancelados) en el período elegido.
                        </p>
                    </div>

                    {/* Filtro por fechas */}
                    <div className="flex flex-wrap items-end gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">Desde</label>
                            <input
                                type="date"
                                value={desde}
                                onChange={(e) => setDesde(e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-slate-500">Hasta</label>
                            <input
                                type="date"
                                value={hasta}
                                onChange={(e) => setHasta(e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-400"
                            />
                        </div>
                        {(desde || hasta) && (
                            <button
                                type="button"
                                onClick={handleLimpiarFechas}
                                className="pb-2 text-xs font-semibold text-red-600 hover:text-red-800"
                            >
                                Quitar filtro
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                        {error}
                    </div>
                )}

                {cargando ? (
                    <p className="py-6 text-center text-sm font-medium text-slate-500">Cargando estadísticas...</p>
                ) : (
                    estadisticas && (
                        <>
                            {/* Tarjetas: total vendido y cantidad de pedidos */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total de ventas</p>
                                    <p className="mt-1 text-3xl font-black text-red-600">
                                        {formatearPrecio(estadisticas.totalVentas)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pedidos registrados</p>
                                    <p className="mt-1 text-3xl font-black text-slate-900">
                                        {estadisticas.cantidadPedidos}
                                    </p>
                                </div>
                            </div>

                            {/* Productos más vendidos */}
                            <div>
                                <h4 className="mb-2 text-sm font-bold text-slate-900">Productos más vendidos</h4>
                                <div className="overflow-hidden rounded-xl border border-slate-200">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="border-b border-slate-200 bg-slate-50">
                                                <tr>
                                                    <th className="px-3 py-2.5 text-left font-semibold text-slate-700">#</th>
                                                    <th className="px-3 py-2.5 text-left font-semibold text-slate-700">Producto</th>
                                                    <th className="px-3 py-2.5 text-right font-semibold text-slate-700">Cantidad vendida</th>
                                                    <th className="px-3 py-2.5 text-right font-semibold text-slate-700">Total generado</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {masVendidos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                                                            No hay ventas en este período.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    masVendidos.map((p, i) => (
                                                        <tr key={p.idProducto}>
                                                            <td className="px-3 py-2.5 font-semibold text-slate-500">{i + 1}</td>
                                                            <td className="px-3 py-2.5 font-medium text-slate-900">{p.nombre}</td>
                                                            <td className="px-3 py-2.5 text-right text-slate-700">{p.cantidadVendida}</td>
                                                            <td className="px-3 py-2.5 text-right text-slate-900">{formatearPrecio(p.totalGenerado)}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Administradores</h3>
                    <p className="mt-1 text-sm text-slate-600">
                        {/* Texto condicional: si es ADMIN ofrece gestión,
                            si es OPERADOR ofrece solo visualización. */}
                        {esAdmin
                            ? 'Gestioná los usuarios del panel, asigná roles y controlá el acceso.'
                            : 'Visualizá el listado de usuarios del panel.'}
                    </p>
                    <Link
                        to="/admin/usuarios"
                        className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        {/* El texto del botón también cambia según el rol. */}
                        {esAdmin ? 'Gestionar administradores' : 'Ver administradores'}
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900">Permisos actuales</h3>
                    <ul className="mt-2 space-y-2 text-sm text-slate-600">
                        {/* Los puntos de color indican visualmente qué permisos
                            tiene el rol actual. Verde = permitido, gris = no. */}
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${esAdmin || esOperador ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Ver listado de administradores
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${puedeEscribir ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Crear, editar y eliminar usuarios
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${puedeEscribir ? 'bg-green-500' : 'bg-slate-300'}`} />
                            Asignar roles
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;