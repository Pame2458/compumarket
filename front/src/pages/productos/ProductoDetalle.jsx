// ProductoDetalle.jsx - Detalle público de un producto con galería, cantidad, carrito y reseñas.

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import GaleriaProducto from '../../components/GaleriaProducto.jsx';
import { useCarrito } from '../../context/Carritocontext';

const API_URL = 'http://localhost:3000/api';

const nombrePublico = (cliente) => {
    if (!cliente) return 'Cliente';
    const inicial = cliente.apellido ? ` ${cliente.apellido.charAt(0)}.` : '';
    return `${cliente.nombre}${inicial}`;
};

// ── Paleta gamer (igual que ProductosIndex) ──────────────────────────────────
const cardGamer =
    'rounded-2xl border border-red-500/[.35] bg-slate-950 shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:border-red-500/[.65]';

const inputGamer =
    'border border-slate-800 bg-slate-900 text-white transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_15px_rgba(239,68,68,0.4)] focus:outline-none';
// ─────────────────────────────────────────────────────────────────────────────

function Estrellas({ puntaje, className = 'text-lg' }) {
    const redondeado = Math.round(puntaje);
    return (
        <span className={`inline-flex ${className}`} aria-label={`${puntaje} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= redondeado ? 'text-amber-400' : 'text-slate-700'}>
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

    const [resenas, setResenas] = useState([]);
    const [promedio, setPromedio] = useState(0);
    const [totalResenas, setTotalResenas] = useState(0);

    // Animación de entrada
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                setError('');
                setCantidad(1);
                setAgregado(false);
                const res = await fetch(`${API_URL}/productos/${id}`);
                const json = await res.json();
                if (!res.ok || !json.estado) throw new Error(json.mensaje || 'No se pudo cargar el producto.');
                setProducto(json.data);
            } catch (err) {
                setError(err.message || 'Error al cargar el producto.');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [id]);

    useEffect(() => {
        const cargarResenas = async () => {
            try {
                const res = await fetch(`${API_URL}/calificaciones/producto/${id}`);
                const json = await res.json();
                if (!res.ok || !json.estado) return;
                setResenas(json.data || []);
                setPromedio(json.promedio || 0);
                setTotalResenas(json.total || 0);
            } catch (err) {
                console.error('No se pudieron cargar las reseñas:', err);
            }
        };
        cargarResenas();
    }, [id]);

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center bg-slate-950">
                <p className="animate-pulse text-sm font-semibold text-slate-400">
                    Sincronizando producto...
                </p>
            </div>
        );
    }

    if (error || !producto) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <p className="mb-4 text-lg font-semibold text-red-400">{error || 'Producto no encontrado.'}</p>
                <Link to="/" className="text-red-500 hover:text-red-400 hover:underline transition">
                    ← Volver al inicio
                </Link>
            </div>
        );
    }

    const disponible = producto.estado === 'activo' && producto.stock > 0;

    const restar = () => setCantidad((c) => Math.max(1, c - 1));
    const sumar  = () => setCantidad((c) => Math.min(producto.stock, c + 1));

    const handleAgregarAlCarrito = () => {
        for (let i = 0; i < cantidad; i++) agregar(producto);
        setAgregado(true);
        setTimeout(() => setAgregado(false), 2500);
    };

    const textoResenas = `${totalResenas} ${totalResenas === 1 ? 'reseña' : 'reseñas'}`;

    return (
        <div
            className={`mx-auto max-w-6xl space-y-8 px-4 py-10 transition-all duration-700 ease-out ${
                visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-6 scale-[0.98] opacity-0 blur-sm'
            }`}
        >
            {/* Volver */}
            <Link
                to="/productos"
                className="inline-flex items-center gap-1 text-sm font-bold text-red-500 transition hover:text-red-400"
            >
                ← Volver al catálogo
            </Link>

            {/* Card principal */}
            <div className={`${cardGamer} grid gap-10 p-6 md:grid-cols-2 md:p-8`}>
                {/* Galería */}
                <GaleriaProducto imagen={producto.imagen} nombre={producto.nombre} />

                {/* Información */}
                <div className="space-y-4">
                    {/* Badges categoría / marca */}
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

                    {/* Nombre */}
                    <h1 className="text-3xl font-black tracking-tight text-white">
                        {producto.nombre}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 text-sm">
                        <Estrellas puntaje={promedio} />
                        <span className="font-bold text-white">{promedio.toFixed(1)}</span>
                        <a
                            href="#resenas"
                            className="text-slate-500 transition hover:text-red-400 hover:underline"
                        >
                            ({textoResenas})
                        </a>
                    </div>

                    {/* Precio */}
                    <p className="text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(239,68,68,0.45)]">
                        ${Number(producto.precio).toLocaleString('es-AR')}
                    </p>

                    {/* Stock */}
                    <p className={`text-sm font-bold ${disponible ? 'text-emerald-400' : 'text-red-400'}`}>
                        {disponible ? `● En stock (${producto.stock} disponibles)` : '● No disponible'}
                    </p>

                    {/* SKU */}
                    {producto.sku && (
                        <p className="font-mono text-xs text-slate-600">SKU: {producto.sku}</p>
                    )}

                    {/* Descripción */}
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

                    {/* Cantidad + Carrito */}
                    {disponible && (
                        <div className="space-y-4 border-t border-slate-800 pt-5">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-bold text-slate-300">Cantidad</span>

                                {/* Selector de cantidad */}
                                <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                                    <button
                                        type="button"
                                        onClick={restar}
                                        disabled={cantidad <= 1}
                                        aria-label="Restar una unidad"
                                        className="px-3.5 py-2 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
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
                                        className="px-3.5 py-2 text-lg font-bold text-slate-300 transition hover:bg-slate-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                        +
                                    </button>
                                </div>

                                {cantidad >= producto.stock && (
                                    <span className="text-xs font-semibold text-amber-400">
                                        Máximo disponible
                                    </span>
                                )}
                            </div>

                            {/* Botón agregar */}
                            <button
                                type="button"
                                onClick={handleAgregarAlCarrito}
                                className="w-full rounded-xl border border-red-500/50 bg-red-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-200 hover:-translate-y-px hover:border-red-400 hover:bg-red-500 hover:shadow-[0_0_28px_rgba(239,68,68,0.6)] active:translate-y-0"
                            >
                                🛒 Agregar al carrito
                            </button>

                            {/* Confirmación */}
                            {agregado && (
                                <p className="rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm font-semibold text-emerald-300">
                                    ✓ Agregaste {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'} al carrito.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Sección Reseñas ──────────────────────────────────────────── */}
            <section id="resenas" className={`${cardGamer} p-6 md:p-8`}>
                <h2 className="text-2xl font-black tracking-tight text-white">
                    Opiniones de clientes
                </h2>

                {/* Resumen de rating */}
                <div className="mt-4 flex items-center gap-3">
                    <span className="text-4xl font-black text-white">{promedio.toFixed(1)}</span>
                    <div>
                        <Estrellas puntaje={promedio} className="text-xl" />
                        <p className="text-sm text-slate-500">Basado en {textoResenas}</p>
                    </div>
                </div>

                {resenas.length === 0 ? (
                    <p className="mt-6 text-sm text-slate-500">
                        Todavía no hay opiniones publicadas para este producto.
                    </p>
                ) : (
                    <ul className="mt-6 space-y-4">
                        {resenas.map((r) => (
                            <li
                                key={r.id}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition-all duration-200 hover:border-red-500/40 hover:shadow-[0_0_14px_rgba(239,68,68,0.15)]"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-white">
                                            {nombrePublico(r.Cliente)}
                                        </span>
                                        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                                            Compra verificada
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(r.fecha).toLocaleDateString('es-AR')}
                                    </span>
                                </div>

                                <Estrellas puntaje={r.puntaje} className="mt-1.5 text-base" />

                                {r.comentario && (
                                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                        {r.comentario}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

export default ProductoDetalle;