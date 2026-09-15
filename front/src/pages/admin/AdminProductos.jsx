// AdminProductos.jsx - CRUD de productos con:
// - Paginación del lado del servidor (LIMIT y OFFSET en MySQL/Sequelize).
// - Ordenamiento dinámico al hacer clic en las cabeceras de columnas.
// - Búsqueda multi-campo (nombre, sku, descripción).
// - Filtro selectivo por Categoría y por Marca.

import { useEffect, useState, useCallback } from 'react';
import {
    listarProductosAdmin,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    listarCategoriasAdmin,
    listarMarcasAdmin,
} from '../../services/adminService.js';

const FORM_VACIO = {
    sku: '', nombre: '', precio: '', stock: '', imagen: '',
    descripcion: '', idCategoria: '', idMarca: '',
};

function AdminProductos() {
    // =========================================================================
    // ESTADOS PRINCIPALES DE DATOS
    // =========================================================================
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // =========================================================================
    // ESTADOS PARA PAGINACIÓN, ORDEN, BÚSQUEDA Y FILTROS (SERVER-SIDE)
    // =========================================================================
    const [pagina, setPagina] = useState(1);
    const [limite, setLimite] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [ordenarPor, setOrdenarPor] = useState('id');
    const [direccion, setDireccion] = useState('ASC');

    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');

    // =========================================================================
    // ESTADOS DEL MODAL DE CREACIÓN / EDICIÓN
    // =========================================================================
    const [modoFormulario, setModoFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState(FORM_VACIO);

    // =========================================================================
    // CARGA DE PRODUCTOS (server-side)
    // =========================================================================
    const cargarProductos = useCallback(async () => {
        try {
            setCargando(true);
            setError('');

            const params = { pagina, limite, ordenarPor, direccion };

            if (busqueda.trim() !== '') {
                params.busqueda = busqueda.trim();
            }
            if (filtroCategoria !== '') {
                params.idCategoria = filtroCategoria;
            }
            if (filtroMarca !== '') {
                params.idMarca = filtroMarca;
            }

            const respuesta = await listarProductosAdmin(params);

            // El backend debe devolver { productos, total, pagina, limite, totalPaginas }
            if (respuesta && respuesta.productos) {
                setProductos(respuesta.productos);
                setTotal(respuesta.total || 0);
                setTotalPaginas(respuesta.totalPaginas || 1);
            } else if (Array.isArray(respuesta)) {
                // Compatibilidad si el backend todavía devuelve un array plano
                setProductos(respuesta);
                setTotal(respuesta.length);
                setTotalPaginas(1);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar productos.');
        } finally {
            setCargando(false);
        }
    }, [pagina, limite, ordenarPor, direccion, busqueda, filtroCategoria, filtroMarca]);

    // Categorías y marcas se cargan una sola vez (para selects de filtro y formulario)
    useEffect(() => {
        Promise.all([listarCategoriasAdmin(), listarMarcasAdmin()])
            .then(([dataCategorias, dataMarcas]) => {
                setCategorias(dataCategorias || []);
                setMarcas(dataMarcas || []);
            })
            .catch((err) => console.error('[FRONTEND] Error al cargar categorías/marcas:', err));
    }, []);

    // Se dispara la carga de productos cada vez que cambia algún parámetro de consulta
    useEffect(() => {
        cargarProductos();
    }, [cargarProductos]);

    // =========================================================================
    // MANEJADORES DE ORDENAMIENTO (SORTING)
    // =========================================================================
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
        const isActive = ordenarPor === columna;
        return (
            <span className="inline-flex items-center ml-1.5 transition-colors">
                {isActive ? (
                    direccion === 'ASC' ? (
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                    )
                ) : (
                    <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                )}
            </span>
        );
    };

    // =========================================================================
    // MANEJADORES DE FILTRO Y BÚSQUEDA
    // =========================================================================
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
        setPagina(1);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda('');
        setPagina(1);
    };

    const handleFiltroCategoriaChange = (e) => {
        setFiltroCategoria(e.target.value);
        setPagina(1);
    };

    const handleFiltroMarcaChange = (e) => {
        setFiltroMarca(e.target.value);
        setPagina(1);
    };

    const handleLimiteChange = (e) => {
        setLimite(parseInt(e.target.value, 10));
        setPagina(1);
    };

    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setFiltroCategoria('');
        setFiltroMarca('');
        setOrdenarPor('id');
        setDireccion('ASC');
        setPagina(1);
    };

    // =========================================================================
    // ACCIONES DEL FORMULARIO Y CRUD
    // =========================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const iniciarCreacion = () => {
        setEditandoId(null);
        setForm(FORM_VACIO);
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const iniciarEdicion = (producto) => {
        setEditandoId(producto.id);
        setForm({
            sku: producto.sku || '',
            nombre: producto.nombre || '',
            precio: producto.precio || '',
            stock: producto.stock || '',
            imagen: producto.imagen || '',
            descripcion: producto.descripcion || '',
            idCategoria: producto.idCategoria || '',
            idMarca: producto.idMarca || '',
        });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const cancelarFormulario = () => {
        setModoFormulario(false);
        setEditandoId(null);
        setForm(FORM_VACIO);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!form.nombre.trim() || !form.precio || !form.imagen.trim() || !form.idCategoria || !form.idMarca) {
            setError('Nombre, precio, imagen, categoría y marca son obligatorios.');
            return;
        }

        try {
            const datos = {
                ...form,
                precio: Number(form.precio),
                stock: Number(form.stock) || 0,
                idCategoria: Number(form.idCategoria),
                idMarca: Number(form.idMarca),
            };

            if (editandoId) {
                await actualizarProducto(editandoId, datos);
                setMensaje('Producto actualizado correctamente.');
            } else {
                await crearProducto(datos);
                setMensaje('Producto creado correctamente.');
            }

            cancelarFormulario();
            await cargarProductos();
        } catch (err) {
            setError(err.message || 'Error al guardar el producto.');
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro de que querés descontinuar este producto?')) return;

        try {
            await eliminarProducto(id);
            setMensaje('Producto descontinuado correctamente.');
            // Si eliminamos el último elemento de una página mayor a 1, retrocedemos
            if (productos.length === 1 && pagina > 1) {
                setPagina(pagina - 1);
            } else {
                await cargarProductos();
            }
        } catch (err) {
            setError(err.message || 'Error al eliminar el producto.');
        }
    };

    // Cálculos para el texto de información de paginación
    const inicioRegistro = total === 0 ? 0 : (pagina - 1) * limite + 1;
    const finRegistro = Math.min(pagina * limite, total);

    return (
        <div className="space-y-6">
            {/* Encabezado y botón nuevo */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
                    <p className="text-sm text-slate-600">
                        Gestioná el catálogo con paginación en servidor, orden dinámico y búsqueda.
                    </p>
                </div>
                {!modoFormulario && (
                    <button
                        onClick={iniciarCreacion}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 hover:shadow"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        
                    </button>
                )}
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
                BARRA DE HERRAMIENTAS: Búsqueda, Filtro por Categoría/Marca y Límite
                =================================================================== */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    {/* Input de búsqueda multi-campo */}
                    <div className="relative md:col-span-4">
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
                            className="w-full rounded-xl border border-slate-300 py-2 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

                    {/* Filtro por Categoría */}
                    <div className="md:col-span-3">
                        <select
                            value={filtroCategoria}
                            onChange={handleFiltroCategoriaChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>{c.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Marca */}
                    <div className="md:col-span-3">
                        <select
                            value={filtroMarca}
                            onChange={handleFiltroMarcaChange}
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="">Todas las marcas</option>
                            {marcas.map((m) => (
                                <option key={m.id} value={m.id}>{m.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Registros por página */}
                    <div className="flex items-center gap-2 md:col-span-2">
                        <label className="text-xs font-medium text-slate-500 whitespace-nowrap">Mostrar:</label>
                        <select
                            value={limite}
                            onChange={handleLimiteChange}
                            className="w-full rounded-xl border border-slate-300 px-2 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="5">5 por pág.</option>
                            <option value="10">10 por pág.</option>
                            <option value="20">20 por pág.</option>
                        </select>
                    </div>
                </div>

                {(busqueda || filtroCategoria || filtroMarca || ordenarPor !== 'id' || direccion !== 'ASC') && (
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
                MODAL PARA CREAR / EDITAR
                =================================================================== */}
            {modoFormulario && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto"
                    onClick={(e) => { if (e.target === e.currentTarget) cancelarFormulario(); }}
                >
                    <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl my-8">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editandoId ? 'Editar producto' : 'Nuevo producto'}
                            </h3>
                            <button type="button" onClick={cancelarFormulario} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
                                    <input type="text" name="sku" value={form.sku} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                                    <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Precio *</label>
                                    <input type="number" step="0.01" min="0.01" name="precio" value={form.precio} onChange={handleChange} required
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Stock</label>
                                    <input type="number" min="0" step="1" name="stock" value={form.stock} onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Categoría *</label>
                                    <select name="idCategoria" value={form.idCategoria} onChange={handleChange} required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Marca *</label>
                                    <select name="idMarca" value={form.idMarca} onChange={handleChange} required
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                        <option value="">Seleccionar marca</option>
                                        {marcas.map((m) => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Imagen (URL) *</label>
                                    <input type="text" name="imagen" value={form.imagen} onChange={handleChange} required
                                        placeholder="https://..."
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
                                    <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                                <button type="button" onClick={cancelarFormulario} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                                    {editandoId ? 'Guardar cambios' : 'Crear producto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===================================================================
                TABLA DE REGISTROS CON CABECERAS ORDENABLES
                =================================================================== */}
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
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th onClick={() => handleSort('nombre')} className="group cursor-pointer px-4 py-3.5 text-left font-semibold text-slate-700 hover:bg-slate-100 select-none transition">
                                    <div className="inline-flex items-center"><span>Nombre</span>{renderSortArrow('nombre')}</div>
                                </th>
                                <th onClick={() => handleSort('precio')} className="group cursor-pointer px-4 py-3.5 text-right font-semibold text-slate-700 hover:bg-slate-100 select-none transition">
                                    <div className="inline-flex items-center justify-end w-full"><span>Precio</span>{renderSortArrow('precio')}</div>
                                </th>
                                <th onClick={() => handleSort('stock')} className="group cursor-pointer px-4 py-3.5 text-right font-semibold text-slate-700 hover:bg-slate-100 select-none transition">
                                    <div className="inline-flex items-center justify-end w-full"><span>Stock</span>{renderSortArrow('stock')}</div>
                                </th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Categoría</th>
                                <th className="px-4 py-3.5 text-left font-semibold text-slate-700">Estado</th>
                                <th className="px-4 py-3.5 text-center font-semibold text-slate-700">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {productos.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                                        <div className="mx-auto max-w-sm space-y-2">
                                            <p className="text-base font-semibold text-slate-700">No se encontraron productos</p>
                                            <p className="text-xs text-slate-400">
                                                {busqueda || filtroCategoria || filtroMarca
                                                    ? 'Probá ajustando o limpiando los filtros de búsqueda.'
                                                    : 'No hay productos registrados en la base de datos.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                productos.map((p) => (
                                    <tr key={p.id} className="transition-colors hover:bg-slate-50/80">
                                        <td className="px-4 py-3 font-medium text-slate-900">{p.nombre}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">${p.precio}</td>
                                        <td className="px-4 py-3 text-right text-slate-600">{p.stock}</td>
                                        <td className="px-4 py-3 text-slate-600">{p.Categorium?.nombre || '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                                                p.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button onClick={() => iniciarEdicion(p)} className="mr-2 rounded-lg px-2.5 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800">
                                                Editar
                                            </button>
                                            <button onClick={() => handleEliminar(p.id)} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-800">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ===================================================================
                    BARRA DE PAGINACIÓN EN SERVIDOR
                    =================================================================== */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/70 px-4 py-3 sm:flex-row">
                    <div className="text-xs text-slate-500">
                        Mostrando <strong className="text-slate-800">{inicioRegistro}</strong> a <strong className="text-slate-800">{finRegistro}</strong> de <strong className="text-slate-800">{total}</strong> registros
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
                            <span>Anterior</span>
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
                                                    pagina === p ? 'bg-indigo-600 text-white shadow-sm' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                                                }`}>
                                                {p}
                                            </button>
                                        </div>
                                    );
                                })}
                        </div>

                        <button onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))} disabled={pagina >= totalPaginas}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40">
                            <span>Siguiente</span>
                        </button>
                        <button onClick={() => setPagina(totalPaginas)} disabled={pagina >= totalPaginas}
                            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40" title="Última página">
                            »
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminProductos;