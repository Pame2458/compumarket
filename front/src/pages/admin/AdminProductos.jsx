// AdminProductos.jsx - CRUD de productos del catálogo.

import { useEffect, useState } from 'react';
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
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [modoFormulario, setModoFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState(FORM_VACIO);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const [dataProductos, dataCategorias, dataMarcas] = await Promise.all([
                listarProductosAdmin(),
                listarCategoriasAdmin(),
                listarMarcasAdmin(),
            ]);
            setProductos(dataProductos || []);
            setCategorias(dataCategorias || []);
            setMarcas(dataMarcas || []);
        } catch (err) {
            setError(err.message || 'Error al cargar productos.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

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
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al guardar el producto.');
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro de que querés descontinuar este producto?')) return;
        try {
            await eliminarProducto(id);
            setMensaje('Producto descontinuado correctamente.');
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al eliminar el producto.');
        }
    };

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Productos</h2>
                    <p className="text-sm text-slate-600">Gestioná el catálogo de productos.</p>
                </div>
                {!modoFormulario && (
                    <button
                        onClick={iniciarCreacion}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        + Nuevo producto
                    </button>
                )}
            </div>

            {mensaje && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                    {mensaje}
                </div>
            )}
            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

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
                            <button type="button" onClick={cancelarFormulario} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
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

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={cancelarFormulario} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
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

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Nombre</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Precio</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Stock</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Categoría</th>
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Estado</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        ) : (
                            productos.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-600">{p.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{p.nombre}</td>
                                    <td className="px-4 py-3 text-slate-600">${p.precio}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.stock}</td>
                                    <td className="px-4 py-3 text-slate-600">{p.Categoria?.nombre || '-'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                                            p.estado === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => iniciarEdicion(p)} className="mr-2 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                                            Editar
                                        </button>
                                        <button onClick={() => handleEliminar(p.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminProductos;