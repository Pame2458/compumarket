import { useEffect, useState, useCallback } from 'react';
import { listarClientesAdmin, listarPedidosDeCliente } from '../../services/adminService.js';

const formatearPrecio = (n) => Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
const formatearFecha = (f) => (f ? new Date(f).toLocaleDateString('es-AR') : '-');
const estaVerificado = (c) => Boolean(c.emailVerificado ?? c.verificado);
const textoEstadoPedido = (e) => String(e || '-').replace('_', ' ');

function AdminClientes() {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    // Paginación, orden, búsqueda y filtro (server-side)
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [ordenarPor, setOrdenarPor] = useState('id');
    const [direccion, setDireccion] = useState('DESC');
    
    // Estado local para el input de búsqueda
    const [busquedaInput, setBusquedaInput] = useState('');
    // Estado con debounce para realizar la petición al backend
    const [busqueda, setBusqueda] = useState('');

    // Modal de pedidos del cliente
    const [clienteSel, setClienteSel] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [cargandoPedidos, setCargandoPedidos] = useState(false);
    const [errorPedidos, setErrorPedidos] = useState('');

    // Debounce: espera 400ms después de que el usuario deja de escribir antes de filtrar
    useEffect(() => {
        const timer = setTimeout(() => {
            setBusqueda(busquedaInput);
            setPagina(1);
        }, 400);

        return () => clearTimeout(timer);
    }, [busquedaInput]);

    const cargarDatos = useCallback(async () => {
        try {
            setCargando(true);
            setError('');

            const params = { pagina, limite, ordenarPor, direccion };
            if (busqueda.trim() !== '') params.busqueda = busqueda.trim();

            const respuesta = await listarClientesAdmin(params);

            if (respuesta && respuesta.clientes) {
                setClientes(respuesta.clientes);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                setClientes(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar los clientes.');
        } finally {
            setCargando(false);
        }
    }, [pagina, limite, ordenarPor, direccion, busqueda]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // ---- Orden ----
    const handleSort = (columna) => {
        if (ordenarPor === columna) {
            setDireccion((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
        } else {
            setOrdenarPor(columna);
            setDireccion('ASC');
        }
        setPagina(1);
    };

    const renderSortArrow = (columna) => {
        const activa = ordenarPor === columna;
        return (
            <span className="ml-1.5 inline-flex items-center">
                {activa ? (
                    <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={direccion === 'ASC' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                    </svg>
                ) : (
                    <svg className="h-3.5 w-3.5 text-slate-300 opacity-60 group-hover:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                )}
            </span>
        );
    };

    const thClase =
        'group cursor-pointer select-none px-4 py-3.5 text-left font-semibold text-slate-700 transition hover:bg-slate-100';

    // ---- Filtros ----
    const handleBusquedaChange = (e) => { 
        setBusquedaInput(e.target.value); 
    };

    const handleLimpiarBusqueda = () => { 
        setBusquedaInput(''); 
        setBusqueda('');
        setPagina(1); 
    };

    const handleLimiteChange = (e) => { 
        setLimite(parseInt(e.target.value, 10)); 
        setPagina(1); 
    };

    const handleLimpiarFiltros = () => {
        setBusquedaInput('');
        setBusqueda('');
        setOrdenarPor('id');
        setDireccion('DESC');
        setPagina(1);
    };

    const hayFiltros = busquedaInput || ordenarPor !== 'id' || direccion !== 'DESC';

    // ---- Pedidos del cliente ----
    const abrirPedidos = async (c) => {
        setClienteSel(c);
        setPedidos([]);
        setErrorPedidos('');
        try {
            setCargandoPedidos(true);
            const respuesta = await listarPedidosDeCliente(c.id);
            setPedidos(Array.isArray(respuesta) ? respuesta : respuesta?.pedidos || []);
        } catch (err) {
            setErrorPedidos(err.message || 'No se pudieron cargar los pedidos.');
        } finally {
            setCargandoPedidos(false);
        }
    };

    const cerrarPedidos = () => setClienteSel(null);

    const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const finRegistro = Math.min(pagina * limite, total);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Clientes</h2>
                <p className="text-sm text-slate-600">
                    Consultá los clientes registrados y revisá su historial de pedidos.
                </p>
            </div>

            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-900">×</button>
                </div>
            )}

            {/* Barra de herramientas */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    <div className="relative md:col-span-8">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={busquedaInput}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por nombre, apellido o email..."
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        {busquedaInput && (
                            <button
                                onClick={handleLimpiarBusqueda}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                                title="Limpiar búsqueda"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-2 md:col-span-2">
                        <label className="whitespace-nowrap text-xs font-medium text-slate-500">Mostrar:</label>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="10">10 por pág.</option>
                            <option value="20">20 por pág.</option>
                            <option value="50">50 por pág.</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 md:text-right">
                        {hayFiltros && (
                            <button
                                onClick={handleLimpiarFiltros}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Restablecer</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-x-auto">
                    {cargando && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                            <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Cargando datos...</span>
                            </div>
                        </div>
                    )}

                    <table className="w-full text-sm">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th onClick={() => handleSort('nombre')} className={thClase}>
                                    <div className="inline-flex items-center"><span>Nombre</span>{renderSortArrow('nombre')}</div>
                                </th>
                                <th onClick={() => handleSort('apellido')} className={thClase}>
                                    <div className="inline-flex items-center"><span>Apellido</span>{renderSortArrow('apellido')}</div>
                                </th>
                                <th onClick={() => handleSort('email')} className={thClase}>
                                    <div className="inline-flex items-center"><span>Email</span>{renderSortArrow('email')}</div>
                                </th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Email verificado</th>
                                <th className="px-4 py-3.5 text-right font-semibold text-slate-700">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {clientes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                                        <div className="mx-auto max-w-sm space-y-2">
                                            <p className="text-base font-semibold text-slate-700">No se encontraron clientes</p>
                                            <p className="text-xs text-slate-400">
                                                {busquedaInput
                                                    ? 'Probá ajustando o limpiando los filtros de búsqueda.'
                                                    : 'Todavía no hay clientes registrados.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                clientes.map((c) => (
                                    <tr key={c.id} className="transition-colors hover:bg-slate-50/80">
                                        <td className="px-4 py-3 font-medium text-slate-900">{c.nombre}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.apellido || '-'}</td>
                                        <td className="px-4 py-3 text-slate-600">{c.email}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    estaVerificado(c) ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {estaVerificado(c) ? 'Verificado' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-right">
                                            <button
                                                onClick={() => abrirPedidos(c)}
                                                className="mr-2 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                                            >
                                                Ver pedidos
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row">
                    <div className="text-xs text-slate-500">
                        Mostrando <strong className="text-slate-800">{inicioRegistro}</strong> a <strong className="text-slate-800">{finRegistro}</strong> de <strong className="text-slate-800">{total}</strong> clientes
                        {totalPaginas > 1 && (
                            <span> (Página <strong>{pagina}</strong> de <strong>{totalPaginas}</strong>)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setPagina(1)} disabled={pagina === 1}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40" title="Primera página">
                            «
                        </button>
                        <button onClick={() => setPagina((prev) => Math.max(prev - 1, 1))} disabled={pagina === 1}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                            Anterior
                        </button>

                        <div className="hidden items-center gap-1 sm:flex">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                                .map((p, idx, arr) => {
                                    const prev = arr[idx - 1];
                                    const esPuntitos = prev && p - prev > 1;
                                    return (
                                        <div key={p} className="flex items-center gap-1">
                                            {esPuntitos && <span className="px-1 text-slate-400">...</span>}
                                            <button onClick={() => setPagina(p)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                    pagina === p
                                                        ? 'bg-indigo-600 text-white shadow-sm'
                                                        : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                                }`}>
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))} disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                            Siguiente
                        </button>
                        <button onClick={() => setPagina(totalPaginas)} disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40" title="Última página">
                            »
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal: pedidos del cliente */}
            {clienteSel && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) cerrarPedidos(); }}
                >
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pedidos de {clienteSel.nombre} {clienteSel.apellido}</h3>
                                <p className="text-xs text-slate-500">{clienteSel.email}</p>
                            </div>
                            <button type="button" onClick={cerrarPedidos}
                                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-6">
                            {cargandoPedidos ? (
                                <p className="animate-pulse py-6 text-center text-sm font-semibold text-slate-400">Cargando pedidos...</p>
                            ) : errorPedidos ? (
                                <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{errorPedidos}</p>
                            ) : pedidos.length === 0 ? (
                                <p className="py-6 text-center text-sm text-slate-500">Este cliente todavía no hizo pedidos.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-wider text-slate-500">
                                        <tr>
                                            <th className="pb-2 font-semibold">Pedido</th>
                                            <th className="pb-2 font-semibold">Fecha</th>
                                            <th className="pb-2 font-semibold">Estado</th>
                                            <th className="pb-2 text-right font-semibold">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {pedidos.map((p) => (
                                            <tr key={p.id}>
                                                <td className="py-2.5 font-semibold text-slate-900">#{p.id}</td>
                                                <td className="py-2.5 text-slate-600">{formatearFecha(p.fecha ?? p.createdAt)}</td>
                                                <td className="py-2.5">
                                                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-700">
                                                        {textoEstadoPedido(p.estado)}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 text-right font-medium text-slate-900">{formatearPrecio(p.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminClientes;