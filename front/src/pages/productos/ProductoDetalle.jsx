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
        <div className="catalogo-contenedor mx-auto max-w-6xl px-4 py-10">
            <Link to="/productos" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-red-600 hover:text-red-500 transition">
                ← Volver al catálogo
            </Link>

            <div className="detalle-card-gamer grid gap-10 rounded-2xl p-6 md:grid-cols-2 md:p-8">
                {/* Galería con todas las imágenes */}
                <GaleriaProducto imagen={producto.imagen} nombre={producto.nombre} />

                {/* Información */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 text-xs">
                        {producto.Categorium?.nombre && (
                            <span className="rounded-full border border-red-500/40 bg-red-950/40 px-3 py-1 font-bold text-red-400">
                                {producto.Categorium.nombre}
                            </span>
                        )}
                        {producto.Marca?.nombre && (
                            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 font-bold text-slate-300">
                                {producto.Marca.nombre}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-black text-white tracking-tight">{producto.nombre}</h1>

                    {/* Resumen de calificación */}
                    <div className="flex items-center gap-2 text-sm">
                        <Estrellas puntaje={promedio} />
                        <span className="font-bold text-white">{promedio.toFixed(1)}</span>
                        <a href="#resenas" className="text-slate-400 hover:text-red-400 hover:underline transition">
                            ({resenas.length} reseñas)
                        </a>
                    </div>

                    <p className="text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]">
                        ${Number(producto.precio).toLocaleString('es-AR')}
                    </p>

                    <p className={`text-sm font-bold ${disponible ? 'text-emerald-400' : 'text-red-400'}`}>
                        {disponible ? `● En stock (${producto.stock} disponibles)` : '● No disponible'}
                    </p>

                    {producto.sku && (
                        <p className="text-xs font-mono text-slate-500">SKU: {producto.sku}</p>
                    )}

                    {producto.descripcion && (
                        <div className="pt-2">
                            <h2 className="mb-1 text-xs font-bold uppercase tracking-wider text-red-400">
                                Descripción
                            </h2>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                                {producto.descripcion}
                            </p>
                        </div>
                    )}

                    {/* Cantidad y botón de carrito */}
                    {disponible && (
                        <div className="space-y-4 border-t border-slate-800 pt-5">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-slate-300">Cantidad</span>
                                <div className="detalle-cantidad-box inline-flex items-center overflow-hidden rounded-lg">
                                    <button
                                        type="button"
                                        onClick={restar}
                                        disabled={cantidad <= 1}
                                        aria-label="Restar una unidad"
                                        className="detalle-cantidad-btn px-3.5 py-2 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        −
                                    </button>
                                    <span className="min-w-[3rem] text-center text-sm font-bold text-white">
                                        {cantidad}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={sumar}
                                        disabled={cantidad >= producto.stock}
                                        aria-label="Sumar una unidad"
                                        className="detalle-cantidad-btn px-3.5 py-2 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>
                                {cantidad >= producto.stock && (
                                    <span className="text-xs font-semibold text-amber-400">Máximo disponible</span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleAgregarAlCarrito}
                                className="detalle-btn-agregar w-full rounded-xl px-6 py-3.5 text-sm"
                            >
                                🛒 Agregar al carrito
                            </button>

                            {agregado && (
                                <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-emerald-300">
                                    ✓ Agregaste {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al carrito.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reseñas de clientes */}
            <section id="resenas" className="mt-14 border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Opiniones de clientes</h2>
                <div className="mt-4 flex items-center gap-3">
                    <span className="text-4xl font-black text-slate-900">{promedio.toFixed(1)}</span>
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
                            <li key={r.id} className="detalle-resena-card rounded-xl p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">{r.cliente}</span>
                                        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                                            Compra verificada
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        {new Date(r.fecha).toLocaleDateString('es-AR')}
                                    </span>
                                </div>
                                <Estrellas puntaje={r.puntaje} className="mt-1.5 text-base" />
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">{r.comentario}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default ProductoDetalle;