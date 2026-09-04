// AdminCategorias.jsx - CRUD de categorías del catálogo.

import { useEffect, useState } from 'react';
import {
    listarCategoriasAdmin,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from '../../services/adminService.js';

function AdminCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const [modoFormulario, setModoFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState({ nombre: '', descripcion: '' });

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await listarCategoriasAdmin();
            setCategorias(data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar categorías.');
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
        setForm({ nombre: '', descripcion: '' });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const iniciarEdicion = (categoria) => {
        setEditandoId(categoria.id);
        setForm({
            nombre: categoria.nombre || '',
            descripcion: categoria.descripcion || '',
        });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const cancelarFormulario = () => {
        setModoFormulario(false);
        setEditandoId(null);
        setForm({ nombre: '', descripcion: '' });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!form.nombre.trim()) {
            setError('El nombre es obligatorio.');
            return;
        }

        try {
            if (editandoId) {
                await actualizarCategoria(editandoId, form);
                setMensaje('Categoría actualizada correctamente.');
            } else {
                await crearCategoria(form);
                setMensaje('Categoría creada correctamente.');
            }
            cancelarFormulario();
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al guardar la categoría.');
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro de que querés eliminar esta categoría?')) return;
        try {
            await eliminarCategoria(id);
            setMensaje('Categoría eliminada correctamente.');
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al eliminar la categoría.');
        }
    };

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Categorías</h2>
                    <p className="text-sm text-slate-600">Gestioná las categorías del catálogo.</p>
                </div>
                {!modoFormulario && (
                    <button
                        onClick={iniciarCreacion}
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
                    >
                        + Nueva categoría
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) cancelarFormulario(); }}
                >
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editandoId ? 'Editar categoría' : 'Nueva categoría'}
                            </h3>
                            <button type="button" onClick={cancelarFormulario} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Nombre *</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={form.nombre}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={form.descripcion}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={cancelarFormulario} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                                    Cancelar
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                                    {editandoId ? 'Guardar cambios' : 'Crear categoría'}
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
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Descripción</th>
                            <th className="px-4 py-3 text-right font-semibold text-slate-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categorias.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    No hay categorías registradas.
                                </td>
                            </tr>
                        ) : (
                            categorias.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-slate-600">{c.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{c.nombre}</td>
                                    <td className="px-4 py-3 text-slate-600">{c.descripcion || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <button onClick={() => iniciarEdicion(c)} className="mr-2 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50">
                                            Editar
                                        </button>
                                        <button onClick={() => handleEliminar(c.id)} className="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
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

export default AdminCategorias;