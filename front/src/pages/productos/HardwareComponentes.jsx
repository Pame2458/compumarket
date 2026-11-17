// HardwareComponentes.jsx - Sección de Hardware y Componentes de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.
// Ahora con paginación, orden, búsqueda y filtro por marca (server-side), igual que en AdminProductos.

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard';
import { useCarrito } from '../../context/Carritocontext';


function HardwareComponentes() {
    const [productos, setProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { agregar } = useCarrito();
    // ---- Paginación, orden, búsqueda y filtro (server-side) ----
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(9);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [ordenarPor, setOrdenarPor] = useState('nombre');
    const [direccion, setDireccion] = useState('ASC');

    const [busqueda, setBusqueda] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // Carga de hardware (se re-ejecuta cada vez que cambia página, orden, búsqueda o marca)
    const cargarHardware = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                idCategoria: 3, // Según tu DER, ID correspondiente a Hardware/Componentes
                pagina,
                limite,
                ordenarPor,
                direccion,
            };
            if (busqueda.trim() !== '') params.busqueda = busqueda.trim();
            if (filtroMarca !== '') params.idMarca = filtroMarca;

            const respuesta = await api.get('/productos', { params });

            // Soporta backend que devuelve { productos, total, totalPaginas } o un array plano
            if (respuesta && respuesta.productos) {
                setProductos(respuesta.productos);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                setProductos(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            }
        } catch (error) {
            console.error('Error al cargar componentes de hardware desde MySQL:', error);
            setError('No se pudieron cargar los productos.');
        } finally {
            setLoading(false);
        }
    }, [pagina, limite, ordenarPor, direccion, busqueda, filtroMarca]);

    // Marcas: se cargan una sola vez, para el select de filtro
    useEffect(() => {
        api.get('/marcas')
            .then((data) => setMarcas(Array.isArray(data) ? data : data.marcas || []))
            .catch((error) => console.error('Error al cargar marcas:', error));
    }, []);

    useEffect(() => {
        cargarHardware();
    }, [cargarHardware]);

    const handleAgregarAlCarrito = (producto) => {
        agregar(producto);
    };

    const handleBusquedaChange = (e) => { setBusqueda(e.target.value); setPagina(1); };
    const handleLimpiarBusqueda = () => { setBusqueda(''); setPagina(1); };
    const handleFiltroMarcaChange = (e) => { setFiltroMarca(e.target.value); setPagina(1); };
    const handleLimiteChange = (e) => { setLimite(parseInt(e.target.value, 10)); setPagina(1); };
    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setFiltroMarca('');
        setOrdenarPor('nombre');
        setDireccion('ASC');
        setPagina(1);
    };

    const hayFiltrosActivos = busqueda || filtroMarca || ordenarPor !== 'nombre' || direccion !== 'ASC';
    const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const finRegistro = Math.min(pagina * limite, total);

    return (
          //de aca al final hice el cambio
        <div className="catalogo-contenedor space-y-8">
            <div className="categoria-banner-gamer rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-3.5">
                    <span className="categoria-icon-gamer flex h-12 w-12 items-center justify-center rounded-xl text-2xl">
                        ⚡
                    </span>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Hardware & Componentes</h2>
                        <p className="text-sm font-semibold text-red-400">
                            Potencia bruta, estabilidad y rendimiento de última generación para tu setup
                        </p>
                    </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-sm">
                    Llevá tu computadora al límite con componentes internos seleccionados para máxima exigencia.
                    Nuestra plataforma se sincroniza de forma directa con el inventario para listar placas de video avanzadas, procesadores multihilo y memorias de alta frecuencia con integridad garantizada.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="categoria-subcard-gamer rounded-xl p-4">
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
                            Procesamiento Gráfico Extremo
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                            Placas de video optimizadas para trazado de rayos (Ray Tracing), renderizado 3D y streaming en alta resolución sin caídas de cuadros.
                        </p>
                    </div>
                    <div className="categoria-subcard-gamer rounded-xl p-4">
                        <h3 className="font-bold text-sm text-white flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></span>
                            Arquitecturas de Alta Eficiencia
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                            Procesadores y placas madre con soporte para PCIe 5.0 y memorias DDR5, asegurando ancho de banda y velocidad crítica.
                        </p>
                    </div>
                </div>
            </div>
                        <div className="catalogo-filtros-box rounded-2xl p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    <div className="relative md:col-span-5">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por nombre, SKU o descripción..."
                            className="catalogo-input w-full rounded-xl py-2 pl-9 pr-8 text-sm"
                        />
                        {busqueda && (
                            <button
                                onClick={handleLimpiarBusqueda}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-red-400"
                                title="Limpiar búsqueda"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="md:col-span-3">
                        <select
                            value={filtroMarca}
                            onChange={handleFiltroMarcaChange}
                            className="catalogo-input w-full rounded-xl px-3 py-2 text-sm"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <select
                            value={`${ordenarPor}-${direccion}`}
                            onChange={(e) => {
                                const [col, dir] = e.target.value.split('-');
                                setOrdenarPor(col);
                                setDireccion(dir);
                                setPagina(1);
                            }}
                            className="catalogo-input w-full rounded-xl px-2 py-2 text-sm"
                        >
                            <option value="nombre-ASC">Nombre A-Z</option>
                            <option value="nombre-DESC">Nombre Z-A</option>
                            <option value="precio-ASC">Precio: menor a mayor</option>
                            <option value="precio-DESC">Precio: mayor a menor</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-400 whitespace-nowrap">Mostrar:</label>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className="catalogo-input w-full rounded-xl px-2 py-2 text-sm"
                        >
                            <option value="6">6</option>
                            <option value="9">9</option>
                            <option value="18">18</option>
                        </select>
                    </div>
                </div>

                {hayFiltrosActivos && (
                    <div className="mt-3 text-right">
                        <button
                            onClick={handleLimpiarFiltros}
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 transition"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Restablecer filtros</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Componentes en Stock</h3>
                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Consultando inventario de hardware...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm font-medium text-red-400">
                        {error}
                    </div>
                ) : productos.length === 0 ? (
                    <div className="catalogo-filtros-box text-center py-12 rounded-xl">
                        <p className="text-sm font-medium text-slate-400">
                            {busqueda || filtroMarca
                                ? 'No se encontraron componentes con esos filtros.'
                                : 'No hay componentes cargados en esta categoría actualmente.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {productos.map((prod) => (
                            <ProductCard
                                key={prod.id}
                                producto={prod}
                                onAgregarAlCarrito={handleAgregarAlCarrito}
                            />
                        ))}
                    </div>
                )}
            </div>
            {total > 0 && (
                <div className="catalogo-filtros-box flex flex-col items-center justify-between gap-4 rounded-2xl px-4 py-3 sm:flex-row">
                    <div className="text-xs text-slate-400">
                        Mostrando <strong className="text-white">{inicioRegistro}</strong> a <strong className="text-white">{finRegistro}</strong> de <strong className="text-white">{total}</strong> componentes
                        {totalPaginas > 1 && (
                            <span> (Página <strong className="text-white">{pagina}</strong> de <strong className="text-white">{totalPaginas}</strong>)</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setPagina(1)}
                            disabled={pagina === 1}
                            className="catalogo-page-btn rounded-lg px-2.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                            title="Primera página"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                            disabled={pagina === 1}
                            className="catalogo-page-btn inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                                .map((p, idx, arr) => {
                                    const prev = arr[idx - 1];
                                    const esPuntitos = prev && p - prev > 1;
                                    return (
                                        <div key={p} className="flex items-center gap-1">
                                            {esPuntitos && <span className="px-1 text-slate-500">...</span>}
                                            <button
                                                onClick={() => setPagina(p)}
                                                className={`catalogo-page-btn rounded-lg px-3 py-1.5 text-xs font-bold ${
                                                    pagina === p ? 'activo' : ''
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button
                            onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
                            disabled={pagina >= totalPaginas}
                            className="catalogo-page-btn inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Siguiente
                        </button>
                        <button
                            onClick={() => setPagina(totalPaginas)}
                            disabled={pagina >= totalPaginas}
                            className="catalogo-page-btn rounded-lg px-2.5 py-1.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40"
                            title="Última página"
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HardwareComponentes;
