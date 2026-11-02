// AdminPedidos.jsx - Gestión de pedidos del panel de administración con:
// - Listado de todos los pedidos con paginación del lado del servidor.
// - Búsqueda por número de pedido o por nombre/email del cliente.
// - Filtro por estado del pedido.
// - Detalle del pedido (comprador e ítems con precio unitario histórico) en un modal.
// - Cambio de estado del pedido: pendiente → en preparación → enviado → entregado o cancelado.

import { useEffect, useState, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { listarPedidosAdmin, actualizarEstadoPedido } from '../../services/adminService.js';

// Estados posibles del pedido (deben coincidir con el ENUM del modelo Pedido).
const ESTADOS = [
    { valor: 'pendiente', etiqueta: 'Pendiente', clases: 'bg-amber-100 text-amber-700' },
    { valor: 'en_preparacion', etiqueta: 'En preparación', clases: 'bg-blue-100 text-blue-700' },
    { valor: 'enviado', etiqueta: 'Enviado', clases: 'bg-indigo-100 text-indigo-700' },
    { valor: 'entregado', etiqueta: 'Entregado', clases: 'bg-emerald-100 text-emerald-700' },
    { valor: 'cancelado', etiqueta: 'Cancelado', clases: 'bg-red-100 text-red-700' },
];

const infoEstado = (valor) => ESTADOS.find((e) => e.valor === valor) || ESTADOS[0];

const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
};

const formatearPrecio = (valor) => `$${Number(valor || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;

function AdminPedidos() {
    // =========================================================================
    // ESTADOS
    // =========================================================================
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Paginación (server-side)
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Búsqueda y filtro por estado (server-side)
    const [busqueda, setBusqueda] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');

    // Pedido que se está viendo en el modal de detalle
    const [pedidoDetalle, setPedidoDetalle] = useState(null);

    // =========================================================================
    // CARGA DE PEDIDOS
    // =========================================================================
    const cargarPedidos = useCallback(async () => {
        try {
            setCargando(true);
            setError('');

            const params = { pagina, limite };

            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }
            if (filtroEstado !== '') {
                params.estado = filtroEstado;
            }

            const respuesta = await listarPedidosAdmin(params);

            // El backend devuelve { pedidos, total, pagina, limite, totalPaginas }
            if (respuesta && respuesta.pedidos) {
                setPedidos(respuesta.pedidos);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar los pedidos.');
        } finally {
            setCargando(false);
        }
    }, [pagina, limite, busqueda, filtroEstado]);

    useEffect(() => {
        cargarPedidos();
    }, [cargarPedidos]);

    // =========================================================================
    // MANEJADORES DE FILTRO Y BÚSQUEDA
    // =========================================================================
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);
    };

    const handleFiltroEstadoChange = (e) => {
        setFiltroEstado(e.target.value);
        setPagina(1);
    };

    const handleLimiteChange = (e) => {
        setLimite(parseInt(e.target.value, 10));
        setPagina(1);
    };

    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setFiltroEstado('');
        setPagina(1);
    };

    // =========================================================================
    // ACCIONES
    // =========================================================================
    // Cambia el estado de un pedido en el backend y actualiza la fila en pantalla.
    const handleCambiarEstado = async (id, nuevoEstado) => {
        setError('');
        setMensaje('');
        try {
            await actualizarEstadoPedido(id, nuevoEstado);
            setPedidos((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
            // Si el detalle abierto es de este pedido, también se actualiza
            setPedidoDetalle((prev) => (prev && prev.id === id ? { ...prev, estado: nuevoEstado } : prev));
            setMensaje(`Pedido #${id} actualizado a "${infoEstado(nuevoEstado).etiqueta}".`);
        } catch (err) {
            setError(err.message || 'Error al actualizar el estado del pedido.');
        }
    };

    const nombreCliente = (pedido) => {
        const c = pedido.Cliente;
        if (!c) return `Cliente #${pedido.idCliente}`;
        const nombreCompleto = `${c.nombre || ''} ${c.apellido || ''}`.trim();
        return nombreCompleto || c.email || `Cliente #${pedido.idCliente}`;
    };

    // Texto de información de paginación
    const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const finRegistro = Math.min(pagina * limite, total);

    // Selector de estado reutilizable (tabla y modal)
    const renderSelectorEstado = (pedido) => (
        <select
            value={pedido.estado}
            onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
            className={`rounded-full border-0 px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 ${infoEstado(pedido.estado).clases}`}
        >
            {ESTADOS.map((e) => (
                <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
            ))}
        </select>
    );

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Pedidos</h2>
                <p className="text-sm text-slate-600">
                    Revisá las órdenes recibidas, consultá su detalle y actualizá el estado logístico.
                </p>
            </div>

            {/* Mensajes de notificación */}
            {mensaje && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    <span>{mensaje}</span>
                    <button onClick={() => setMensaje('')} className="text-emerald-600 hover:text-emerald-900">×</button>
                </div>
            )}
            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-900">×</button>
                </div>
            )}

            {/* ===================================================================
                BARRA DE HERRAMIENTAS: búsqueda y filtro por estado
                =================================================================== */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    {/* Búsqueda por número de pedido o datos del cliente */}
                    <div className="relative md:col-span-7">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por N° de pedido, nombre o email del cliente..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {busqueda && (
                            <button
                                onClick={() => { setBusqueda(''); setPagina(1); }}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                title="Limpiar búsqueda"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Filtro por estado */}
                    <div className="md:col-span-5">
                        <select
                            value={filtroEstado}
                            onChange={handleFiltroEstadoChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Todos los estados</option>
                            {ESTADOS.map((e) => (
                                <option key={e.valor} value={e.valor}>{e.etiqueta}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {(busqueda || filtroEstado) && (
                    <div className="mt-3 text-right">
                        <button
                            onClick={handleLimpiarFiltros}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Restablecer filtros</span>
                        </button>
                    </div>
                )}
            </div>

            {/* ===================================================================
                MODAL DE DETALLE DEL PEDIDO
                =================================================================== */}
            {pedidoDetalle && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setPedidoDetalle(null); }}
                >
                    <div className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">Pedido #{pedidoDetalle.id}</h3>
                            <button
                                type="button"
                                onClick={() => setPedidoDetalle(null)}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-5 p-6">
                            {/* Datos del comprador */}
                            <div className="grid gap-3 text-sm sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium uppercase text-slate-400">Comprador</p>
                                    <p className="font-medium text-slate-900">{nombreCliente(pedidoDetalle)}</p>
                                    {pedidoDetalle.Cliente?.email && (
                                        <p className="text-slate-600">{pedidoDetalle.Cliente.email}</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-medium uppercase text-slate-400">Fecha</p>
                                    <p className="text-slate-900">{formatearFecha(pedidoDetalle.fecha)}</p>
                                </div>
                                <div>
                                    <p className="mb-1 text-xs font-medium uppercase text-slate-400">Estado</p>
                                    {renderSelectorEstado(pedidoDetalle)}
                                </div>
                            </div>

                            {/* Ítems del pedido */}
                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-200 bg-slate-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-semibold text-slate-700">Producto</th>
                                            <th className="px-3 py-2 text-right font-semibold text-slate-700">Cant.</th>
                                            <th className="px-3 py-2 text-right font-semibold text-slate-700">Precio unit.</th>
                                            <th className="px-3 py-2 text-right font-semibold text-slate-700">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(pedidoDetalle.DetallePedidos || []).map((d) => (
                                            <tr key={d.id}>
                                                <td className="px-3 py-2 text-slate-900">{d.Producto?.nombre || `Producto #${d.idProducto}`}</td>
                                                <td className="px-3 py-2 text-right text-slate-600">{d.cantidad}</td>
                                                <td className="px-3 py-2 text-right text-slate-600">{formatearPrecio(d.precioUnitario)}</td>
                                                <td className="px-3 py-2 text-right text-slate-600">{formatearPrecio(d.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                <span className="text-sm font-medium text-slate-600">Total del pedido</span>
                                <span className="text-lg font-bold text-slate-900">{formatearPrecio(pedidoDetalle.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===================================================================
                TABLA DE PEDIDOS
                =================================================================== */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-x-auto">
                    {cargando && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                            <div className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
                                Cargando pedidos...
                            </div>
                        </div>
                    )}

                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">N°</th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Fecha</th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Cliente</th>
                                <th className="px-4 py-3.5 text-center font-semibold text-slate-700">Detalle</th>
                                <th className="px-4 py-3.5 text-right font-semibold text-slate-700">Total</th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Estado</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {pedidos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                                        <p className="text-base font-semibold text-slate-700">No se encontraron pedidos</p>
                                        <p className="text-xs text-slate-400">
                                            {busqueda || filtroEstado
                                                ? 'Probá ajustando o limpiando los filtros.'
                                                : 'Cuando un cliente confirme una compra, va a aparecer acá.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                pedidos.map((p) => (
                                    <tr key={p.id} className="transition-colors hover:bg-slate-50/80">
                                        <td className="px-4 py-3 font-medium text-slate-900">#{p.id}</td>
                                        <td className="px-4 py-3 text-slate-600">{formatearFecha(p.fecha)}</td>
                                        <td className="px-4 py-3 text-slate-600">{nombreCliente(p)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => setPedidoDetalle(p)}
                                                title="Ver detalle"
                                                aria-label={`Ver detalle del pedido ${p.id}`}
                                                className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-900">{formatearPrecio(p.total)}</td>
                                        <td className="px-4 py-3">{renderSelectorEstado(p)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===================================================================
                    BARRA DE PAGINACIÓN
                    =================================================================== */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>
                            Mostrando <strong className="text-slate-800">{inicioRegistro}</strong> a{' '}
                            <strong className="text-slate-800">{finRegistro}</strong> de{' '}
                            <strong className="text-slate-800">{total}</strong> pedidos
                            {totalPaginas > 1 && (
                                <span> (Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>)</span>
                            )}
                        </span>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none"
                        >
                            <option value="5">5 por pág.</option>
                            <option value="10">10 por pág.</option>
                            <option value="20">20 por pág.</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPagina(1)}
                            disabled={pagina === 1}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Primera página"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                            disabled={pagina === 1}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
                            disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Siguiente
                        </button>
                        <button
                            onClick={() => setPagina(totalPaginas)}
                            disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                            title="Última página"
                        >
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPedidos;