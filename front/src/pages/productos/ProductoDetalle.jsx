// ProductoDetalle.jsx - Detalle público de un producto con galería de imágenes.

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaleriaProducto from '../../components/GaleriaProducto.jsx';

// El backend monta las rutas bajo /api. Ajustá el puerto al de tu backend.
const API_URL = 'http://localhost:3000/api';

function ProductoDetalle() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError('');
                const res = await fetch(`${API_URL}/productos/${id}`);
                const json = await res.json();
                if (!res.ok || !json.estado) {
                    throw new Error(json.mensaje || 'No se pudo cargar el producto.');
                }
                setProducto(json.data);
            } catch (err) {
                setError(err.message || 'Error al cargar el producto.');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando producto...</p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <p className="mb-4 text-lg font-semibold text-slate-700">{error || 'Producto no encontrado.'}</p>
                <Link to="/" className="text-indigo-600 hover:underline">Volver al inicio</Link>
            </div>
        );
    }

    const disponible = producto.estado === 'activo' && producto.stock > 0;

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <Link to="/" className="mb-6 inline-block text-sm text-indigo-600 hover:underline">
                ← Volver
            </Link>

            <div className="grid gap-10 md:grid-cols-2">
                {/* Galería con todas las imágenes */}
                <GaleriaProducto imagen={producto.imagen} nombre={producto.nombre} />

                {/* Información */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {producto.Categorium?.nombre && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                                {producto.Categorium.nombre}
                            </span>
                        )}
                        {producto.Marca?.nombre && (
                            <span className="rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-700">
                                {producto.Marca.nombre}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">{producto.nombre}</h1>

                    <p className="text-3xl font-semibold text-slate-900">${producto.precio}</p>

                    <p className={`text-sm font-medium ${disponible ? 'text-emerald-600' : 'text-red-600'}`}>
                        {disponible ? `En stock (${producto.stock} disponibles)` : 'No disponible'}
                    </p>

                    {producto.sku && (
                        <p className="text-xs text-slate-400">SKU: {producto.sku}</p>
                    )}

                    {producto.descripcion && (
                        <div>
                            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                Descripción
                            </h2>
                            <p className="whitespace-pre-line text-slate-700">{producto.descripcion}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductoDetalle;