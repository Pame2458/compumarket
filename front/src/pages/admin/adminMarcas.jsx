// AdminMarcas.jsx - CRUD de marcas del catálogo.

import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from "lucide-react";
import {
    listarMarcasAdmin,
    crearMarca,
    actualizarMarca,
    eliminarMarca,
} from '../../services/adminService.js';

function AdminMarcas() {
    const [marcas, setMarcas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [marcaAEliminar, setMarcaAEliminar] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const marcasFiltradas = marcas.filter((m) =>
        (m.nombre || '').toLowerCase().includes(busqueda.trim().toLowerCase())
    );
    const handleBusquedaChange = (e) => setBusqueda(e.target.value);
    const handleLimpiarBusqueda = () => setBusqueda('');
    const handleLimpiarFiltros = () => setBusqueda('');

    const [modoFormulario, setModoFormulario] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [form, setForm] = useState({ nombre: '' });

    const cargarDatos = async () => {
        try {
            setCargando(true);
            const data = await listarMarcasAdmin();
            setMarcas(data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar marcas.');
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
        setForm({ nombre: '' });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const iniciarEdicion = (marca) => {
        setEditandoId(marca.id);
        setForm({ nombre: marca.nombre || '' });
        setModoFormulario(true);
        setError('');
        setMensaje('');
    };

    const cancelarFormulario = () => {
        setModoFormulario(false);
        setEditandoId(null);
        setForm({ nombre: '' });
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
                await actualizarMarca(editandoId, form);
                setMensaje('Marca actualizada correctamente.');
            } else {
                await crearMarca(form);
                setMensaje('Marca creada correctamente.');
            }
            cancelarFormulario();
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al guardar la marca.');
        }
    };

    const confirmarEliminar = async () => {
        const id = marcaAEliminar.id;
        setMarcaAEliminar(null);
        setError('');
        setMensaje('');
        try {
            await eliminarMarca(id);
            setMensaje('Marca eliminada correctamente.');
            await cargarDatos();
        } catch (err) {
            setError(err.message || 'Error al eliminar la marca.');
        }
    };

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando marcas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Marcas</h2>
                    <p className="text-sm text-slate-600">Gestioná las marcas del catálogo.</p>
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
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
                    <div className="relative md:col-span-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            placeholder="Buscar por nombre..."
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
                </div>

                {busqueda && (
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
            {modoFormulario && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) cancelarFormulario(); }}
                >
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {editandoId ? 'Editar marca' : 'Nueva marca'}
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
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={cancelarFormulario} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                                    Cancelar
                                </button>
                                <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                                    {editandoId ? 'Guardar cambios' : 'Crear marca'}
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
                            <th className="px-4 py-3 text-left font-semibold text-slate-700">Nombre</th>
                            <th className="px-4 py-3 text-center font-semibold text-slate-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {marcasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-8 text-center text-slate-500">
                                    No hay marcas registradas.
                                </td>
                            </tr>
                        ) : (
                            marcasFiltradas.map((m) => (
                                <tr key={m.id} className="transition-colors hover:bg-slate-50/80">
                                    <td className="px-4 py-3 font-medium text-slate-900">{m.nombre}</td>
                                    <td className="px-4 py-3 text-center whitespace-nowrap">
                                        <button
                                            onClick={() => iniciarEdicion(m)}
                                            title="Editar"
                                            aria-label={`Editar ${m.nombre}`}
                                            className="mr-1 rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => setMarcaAEliminar(m)}
                                            title="Eliminar"
                                            aria-label={`Eliminar ${m.nombre}`}
                                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-800"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {marcaAEliminar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setMarcaAEliminar(null); }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="border-b border-slate-200 px-6 py-4">
                            <h3 className="text-lg font-bold text-slate-900">Eliminar marca</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600">
                                ¿Seguro que querés eliminar <span className="font-semibold text-slate-900">{marcaAEliminar.nombre}</span>?
                            </p>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMarcaAEliminar(null)}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmarEliminar}
                                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default AdminMarcas;