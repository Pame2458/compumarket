// ProductosIndex.jsx - Vista introductoria del Catálogo de compuMarket.
// Muestra todos los productos con búsqueda, filtro por marca, orden y paginación.

import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useCarrito } from '../../context/Carritocontext';

// Obtiene el nombre de la marca de un producto (por si viene como objeto o como texto)
const nombreMarca = (p) => p.marca?.nombre ?? p.marca_nombre ?? p.marcaNombre ?? (typeof p.marca === 'string' ? p.marca : '');

function ProductosIndex() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { agregar } = useCarrito();

    // Búsqueda, filtros, orden y paginación
    const [busqueda, setBusqueda] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');
    const [ordenarPor, setOrdenarPor] = useState('nombre');
    const [direccion, setDireccion] = useState('ASC');
    const [limite, setLimite] = useState(6);
    const [pagina, setPagina] = useState(1);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const respuesta = await api.get('/productos', { params: { pagina: 1, limite: 100 } });

                if (respuesta && respuesta.productos) {
                    setProductos(respuesta.productos);
                } else if (Array.isArray(respuesta)) {
                    setProductos(respuesta);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

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

    // Lista de marcas disponibles, sacada de los productos cargados
    const marcas = useMemo(
        () => [...new Set(productos.map(nombreMarca).filter(Boolean))].sort(),
        [productos]
    );

    // Filtrar + ordenar
    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        const lista = productos.filter((p) => {
            const coincideTexto =
                !texto ||
                (p.nombre || '').toLowerCase().includes(texto) ||
                (p.sku || '').toLowerCase().includes(texto) ||
                (p.descripcion || '').toLowerCase().includes(texto);
            const coincideMarca = !filtroMarca || nombreMarca(p) === filtroMarca;
            return coincideTexto && coincideMarca;
        });

        lista.sort((a, b) => {
            let r;
            if (ordenarPor === 'precio') {
                r = Number(a.precio) - Number(b.precio);
            } else {
                r = (a.nombre || '').localeCompare(b.nombre || '');
            }
            return direccion === 'ASC' ? r : -r;
        });

        return lista;
    }, [productos, busqueda, filtroMarca, ordenarPor, direccion]);

    // Paginación
    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / limite));
    const paginaActual = Math.min(pagina, totalPaginas);
    const productosPagina = productosFiltrados.slice((paginaActual - 1) * limite, paginaActual * limite);

    const hayFiltrosActivos = busqueda || filtroMarca || ordenarPor !== 'nombre' || direccion !== 'ASC';

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Barra de búsqueda, filtro por marca, orden y límite */}
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
                                <option key={m} value={m}>{m}</option>
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

            {/* Listado de productos */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Todos los Productos</h3>

                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Sincronizando inventario...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : productosFiltrados.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            No se encontraron productos.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {productosPagina.map((prod) => (
                                <ProductCard
                                    key={prod.id}
                                    producto={prod}
                                    onAgregarAlCarrito={handleAgregarAlCarrito}
                                />
                            ))}
                        </div>

                        {/* Paginación */}
                        <div className="flex flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
                            <p className="text-xs font-medium text-slate-500">
                                Mostrando {productosPagina.length} de {productosFiltrados.length} productos
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setPagina(n)}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-bold ${
                                            n === paginaActual
                                                ? 'bg-red-600 text-white'
                                                : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductosIndex;