// LaptopsNotebooks.jsx - Sección de Laptops y Notebooks de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.
// Ahora con paginación, orden, búsqueda y filtro por marca (server-side), igual que en AdminProductos.

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard'; // Componente para mostrar cada producto

function LaptopsNotebooks() {
    const [productos, setProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // ---- Paginación, orden, búsqueda y filtro (server-side) ----
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(9);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [ordenarPor, setOrdenarPor] = useState('nombre');
    const [direccion, setDireccion] = useState('ASC');

    const [busqueda, setBusqueda] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // Carga de laptops (se re-ejecuta cada vez que cambia página, orden, búsqueda o marca)
    const cargarLaptops = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                idCategoria: 1, // Según tu DER, ID correspondiente a Laptops/Notebooks
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
            console.error('Error al cargar laptops desde MySQL:', error);
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
        cargarLaptops();
    }, [cargarLaptops]);

    const handleAgregarAlCarrito = (producto) => {
        console.log('Añadiendo a la tabla CarritoItem el producto ID:', producto.id);
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
        <div className="space-y-8 animate-fade-in">
            {/* Banner Descriptivo de la Categoría */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    {/* Estética unificada con el rojo corporativo compuMarket */}
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-600">
                        💻
                    </span>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Laptops & Notebooks</h2>
                        <p className="text-sm font-semibold text-slate-500">
                            Equipos portátiles de alto rendimiento para gaming, diseño y productividad extrema
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                    Rendimiento sin límites vayas donde vayas. Nuestra plataforma sincroniza de forma directa el stock de laptops de última generación, equipadas con pantallas de alta tasa de refresco, procesadores avanzados y soluciones térmicas de vanguardia para máxima exigencia profesional.
                </p>

                {/* Sub-bloques informativos técnicos */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Poder Gamer Portátil
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Equipos equipados con placas gráficas dedicadas de última serie y pantallas fluidas ideales para eSports y trazado de rayos en tiempo real.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Estaciones de Trabajo Móviles
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Máxima autonomía y pantallas de alta fidelidad cromática calibradas de fábrica, optimizadas para desarrollo, arquitectura y edición de video.
                        </p>
                    </div>
                </div>
            </div>

            {/* ===================================================================
                NUEVO: BARRA DE BÚSQUEDA, FILTRO POR MARCA, ORDEN Y LÍMITE
                =================================================================== */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    {/* Búsqueda */}
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
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        {busqueda && (
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

                    {/* Filtro por Marca */}
                    <div className="md:col-span-3">
                        <select
                            value={filtroMarca}
                            onChange={handleFiltroMarcaChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Orden */}
                    <div className="md:col-span-2">
                        <select
                            value={`${ordenarPor}-${direccion}`}
                            onChange={(e) => {
                                const [col, dir] = e.target.value.split('-');
                                setOrdenarPor(col);
                                setDireccion(dir);
                                setPagina(1);
                            }}
                            className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        >
                            <option value="nombre-ASC">Nombre A-Z</option>
                            <option value="nombre-DESC">Nombre Z-A</option>
                            <option value="precio-ASC">Precio: menor a mayor</option>
                            <option value="precio-DESC">Precio: mayor a menor</option>
                        </select>
                    </div>

                    {/* Registros por página */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Mostrar:</label>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
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
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Restablecer filtros</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Grilla Dinámica con Productos Reales del Backend */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Modelos Disponibles</h3>

                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Sincronizando inventario de notebooks...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            {busqueda || filtroMarca
                                ? 'No se encontraron equipos con esos filtros.'
                                : 'No hay equipos cargados en esta categoría actualmente.'}
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

            {/* ===================================================================
                NUEVO: PAGINACIÓN EN SERVIDOR
                =================================================================== */}
            {total > 0 && (
                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row">
                    <div className="text-xs text-slate-500">
                        Mostrando <strong className="text-slate-800">{inicioRegistro}</strong> a <strong className="text-slate-800">{finRegistro}</strong> de <strong className="text-slate-800">{total}</strong> equipos
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
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
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
                                            {esPuntitos && <span className="px-1 text-slate-400">...</span>}
                                            <button onClick={() => setPagina(p)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                    pagina === p ? 'bg-red-600 text-white shadow-sm' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                                }`}>
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))} disabled={pagina >= totalPaginas}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                            Siguiente
                        </button>
                        <button onClick={() => setPagina(totalPaginas)} disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40" title="Última página">
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LaptopsNotebooks;