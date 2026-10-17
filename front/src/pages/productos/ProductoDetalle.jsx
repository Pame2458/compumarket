// ProductoDetalle.jsx - Detalle público de un producto con galería, cantidad, carrito y reseñas.

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaleriaProducto from '../../components/GaleriaProducto.jsx';
import { useCarrito } from '../../context/Carritocontext';

// El backend monta las rutas bajo /api. Ajustá el puerto al de tu backend.
const API_URL = 'http://localhost:3000/api';

// DATOS DE EJEMPLO: después se reemplazan por las reseñas reales del backend
// (tabla Calificacion, solo de clientes que compraron el producto).
const RESENAS_EJEMPLO = [
    {
        id: 1,
        cliente: 'Martina G.',
        puntaje: 5,
        fecha: '2026-09-28',
        comentario: 'Llegó rápido y funciona perfecto. Muy buena relación precio-calidad.',
    },
    {
        id: 2,
        cliente: 'Lucas R.',
        puntaje: 4,
        fecha: '2026-09-15',
        comentario: 'Cumple con lo que promete. El embalaje podría ser mejor.',
    },
    {
        id: 3,
        cliente: 'Camila P.',
        puntaje: 5,
        fecha: '2026-08-30',
        comentario: 'Lo recomiendo, lo uso todos los días sin problemas.',
    },
];

// Muestra estrellas llenas y vacías según el puntaje (de 0 a 5).
function Estrellas({ puntaje, className = 'text-lg' }) {
    const redondeado = Math.round(puntaje);
    return (
        <span className={`inline-flex ${className}`} aria-label={`${puntaje} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= redondeado ? 'text-amber-400' : 'text-slate-300'}>
                    ★
                </span>
            ))}
        </span>
    );
}

function ProductoDetalle() {
    const { id } = useParams();
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [agregado, setAgregado] = useState(false);
    const { agregar } = useCarrito();

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError('');
                setCantidad(1);
                setAgregado(false);
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

    // Cantidad: mínimo 1 y máximo el stock disponible.
    const restar = () => setCantidad((c) => Math.max(1, c - 1));
    const sumar = () => setCantidad((c) => Math.min(producto.stock, c + 1));

    const handleAgregarAlCarrito = () => {
        // agregar(producto) suma una unidad, así que se llama una vez por cada unidad elegida.
        for (let i = 0; i < cantidad; i++) {
            agregar(producto);
        }
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2500);
    };

    // Promedio de las reseñas de ejemplo (después vendrá del backend).
    const resenas = RESENAS_EJEMPLO;
    const promedio = resenas.length
        ? resenas.reduce((acc, r) => acc + r.puntaje, 0) / resenas.length
        : 0;

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

                    {/* Resumen de calificación */}
                    <div className="flex items-center gap-2 text-sm">
                        <Estrellas puntaje={promedio} />
                        <span className="font-semibold text-slate-800">{promedio.toFixed(1)}</span>
                        <a href="#resenas" className="text-slate-500 hover:text-indigo-600 hover:underline">
                            ({resenas.length} reseñas)
                        </a>
                    </div>

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

                    {/* Cantidad y botón de carrito */}
                    {disponible && (
                        <div className="space-y-3 border-t border-slate-200 pt-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-700">Cantidad</span>
                                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
                                    <button
                                        type="button"
                                        onClick={restar}
                                        disabled={cantidad <= 1}
                                        aria-label="Restar una unidad"
                                        className="px-3 py-2 text-lg font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-[3rem] text-center text-sm font-semibold text-slate-900">
                                        {cantidad}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={sumar}
                                        disabled={cantidad >= producto.stock}
                                        aria-label="Sumar una unidad"
                                        className="px-3 py-2 text-lg font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                                    >
                                        +
                                    </button>
                                </div>
                                {cantidad >= producto.stock && (
                                    <span className="text-xs text-slate-500">Máximo disponible</span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleAgregarAlCarrito}
                                className="w-full rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
                            >
                                Agregar al carrito
                            </button>

                            {agregado && (
                                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                                    Agregaste {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al carrito.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reseñas de clientes que ya compraron el producto */}
            <section id="resenas" className="mt-14 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900">Opiniones de clientes</h2>

                <div className="mt-4 flex items-center gap-3">
                    <span className="text-4xl font-bold text-slate-900">{promedio.toFixed(1)}</span>
                    <div>
                        <Estrellas puntaje={promedio} className="text-xl" />
                        <p className="text-sm text-slate-500">Basado en {resenas.length} reseñas</p>
                    </div>
                </div>

                {resenas.length === 0 ? (
                    <p className="mt-6 text-sm text-slate-500">
                        Todavía no hay reseñas para este producto.
                    </p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {resenas.map((r) => (
                            <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-slate-900">{r.cliente}</span>
                                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                            Compra verificada
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(r.fecha).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                                <Estrellas puntaje={r.puntaje} className="mt-1 text-base" />
                                <p className="mt-2 text-sm text-slate-700">{r.comentario}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default ProductoDetalle;