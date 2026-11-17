// HardwareComponentes.jsx - Sección de Hardware y Componentes de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.
// Con paginación, orden, búsqueda y filtro por marca (server-side). Estilos 100% Tailwind,
// con la misma paleta que ProductosIndex (azul oscuro, texto negro en títulos, botones rojos).

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard';
import { useCarrito } from '../../context/Carritocontext';

// Estilos compartidos (misma paleta que ProductosIndex)
const filtrosBox =
    'rounded-2xl border border-red-500/[.35] bg-slate-950 shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:border-red-500/[.65]';

const inputGamer =
    'border border-slate-800 bg-slate-900 text-white transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] focus:outline-none [&_option]:bg-slate-950 [&_option]:text-white';

const botonPagina =
    'rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40';
const botonPaginaNormal =
    'border-slate-800 bg-slate-950 font-semibold text-slate-300 enabled:hover:-translate-y-px enabled:hover:border-red-500 enabled:hover:bg-red-500/15 enabled:hover:text-white enabled:hover:shadow-[0_0_12px_rgba(239,68,68,0.35)]';
const botonPaginaActivo =
    'border-red-500 bg-red-600 font-bold text-white shadow-[0_0_16px_rgba(220,38,38,0.55)]';

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

    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    // Carga (se re-ejecuta cada vez que cambia página, orden, búsqueda o marca)
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
        <div
            className={`space-y-8 transition-all duration-700 ease-out ${
                visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-6 scale-[0.98] opacity-0 blur-sm'
            }`}
        >
            {/* Banner descriptivo de la categoría */}
            <div className={`${filtrosBox} space-y-6 p-8`}>
                <div className="flex items-center gap-3.5">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/50 bg-red-600/15 text-2xl text-red-400 shadow-[0_0_14px_rgba(220,38,38,0.35)]">
                        ⚡
                    </span>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-white">Hardware & Componentes</h2>
                        <p className="text-sm font-semibold text-red-400">
                            Potencia bruta, estabilidad y rendimiento de última generación para tu setup
                        </p>
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-300">
                    Llevá tu computadora al límite con componentes internos seleccionados para máxima exigencia. Nuestra plataforma se sincroniza de forma directa con el inventario para listar placas de video avanzadas, procesadores multihilo y memorias de alta frecuencia con integridad garantizada.
                </p>

                {/* Sub-bloques informativos técnicos */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                            Procesamiento Gráfico Extremo
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                            Placas de video optimizadas para trazado de rayos (Ray Tracing), renderizado 3D y streaming en alta resolución sin caídas de cuadros.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                            <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></span>
                            Arquitecturas de Alta Eficiencia
                        </h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                            Procesadores y placas madre con soporte para PCIe 5.0 y memorias DDR5, asegurando ancho de banda y velocidad crítica.
                        </p>
                    </div>
                </div>
            </div>

            {/* Barra de búsqueda, filtro por marca, orden y límite */}
            <div className={`${filtrosBox} p-4`}>
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
                            className={`${inputGamer} w-full rounded-xl py-2 pl-9 pr-8 text-sm`}
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

                    {/* Filtro por Marca */}
                    <div className="md:col-span-3">
                        <select
                            value={filtroMarca}
                            onChange={handleFiltroMarcaChange}
                            className={`${inputGamer} w-full rounded-xl px-3 py-2 text-sm`}
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
                            className={`${inputGamer} w-full rounded-xl px-2 py-2 text-sm`}
                        >
                            <option value="nombre-ASC">Nombre A-Z</option>
                            <option value="nombre-DESC">Nombre Z-A</option>
                            <option value="precio-ASC">Precio: menor a mayor</option>
                            <option value="precio-DESC">Precio: mayor a menor</option>
                        </select>
                    </div>

                    {/* Registros por página */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <label className="whitespace-nowrap text-xs font-semibold text-slate-400">Mostrar:</label>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className={`${inputGamer} w-full rounded-xl px-2 py-2 text-sm`}
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
                            className="inline-flex items-center gap-1 text-xs font-bold text-red-400 transition hover:text-red-300"
                        >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Restablecer filtros</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Grilla dinámica con productos reales del backend */}
            <div className="space-y-4">
                <h3 className="text-lg font-black tracking-tight text-slate-900">Componentes en Stock</h3>

                {loading ? (
                    <div className="animate-pulse py-10 text-center text-sm font-semibold text-slate-400">
                        Consultando inventario de hardware...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-sm font-medium text-red-400">
                        {error}
                    </div>
                ) : productos.length === 0 ? (
                    <div className={`${filtrosBox} py-12 text-center`}>
                        <p className="text-sm font-medium text-slate-400">
                            {busqueda || filtroMarca
                                ? 'No se encontraron componentes con esos filtros.'
                                : 'No hay componentes cargados en esta categoría actualmente.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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

            {/* Paginación en servidor */}
            {total > 0 && (
                <div className={`${filtrosBox} flex flex-col items-center justify-between gap-4 px-4 py-3 sm:flex-row`}>
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
                            className={`${botonPagina} ${botonPaginaNormal}`}
                            title="Primera página"
                        >
                            «
                        </button>
                        <button
                            onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
                            disabled={pagina === 1}
                            className={`${botonPagina} ${botonPaginaNormal}`}
                        >
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
                                            {esPuntitos && <span className="px-1 text-slate-500">...</span>}
                                            <button
                                                onClick={() => setPagina(p)}
                                                className={`${botonPagina} ${
                                                    pagina === p ? botonPaginaActivo : botonPaginaNormal
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
                            className={`${botonPagina} ${botonPaginaNormal}`}
                        >
                            Siguiente
                        </button>
                        <button
                            onClick={() => setPagina(totalPaginas)}
                            disabled={pagina >= totalPaginas}
                            className={`${botonPagina} ${botonPaginaNormal}`}
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