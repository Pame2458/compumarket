// Checkout.jsx - Página de finalizar compra (resumen del pedido y confirmación).

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle } from 'lucide-react';
import { useCarrito } from '../../context/Carritocontext';
import { useAuth } from '../../context/AuthContext.jsx';
import { postConfirmarPedido } from '../../services/checkoutService.js';

const URL_IMAGENES = 'http://localhost:3000';

const formatearPrecio = (n) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

// Toma la primera imagen, venga como array, como texto JSON o como un solo string.
const primeraImagen = (imagen) => {
    if (!imagen) return null;
    let lista = imagen;
    if (!Array.isArray(lista)) {
        try {
            lista = JSON.parse(lista);
        } catch {
            lista = [lista];
        }
    }
    if (!Array.isArray(lista)) lista = [lista];
    const ruta = lista[0];
    if (!ruta) return null;
    return ruta.startsWith('http') ? ruta : `${URL_IMAGENES}${ruta}`;
};

function Checkout() {
    const { items, total, cantidadTotal, vaciar } = useCarrito();
    const { usuario } = useAuth(); // null si el cliente no inició sesión

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

    // Convierte el carrito en un pedido guardado en la base de datos.
    const handleConfirmar = async () => {
        setCargando(true);
        setError('');
        try {
            // Mandamos solo id y cantidad: el precio lo toma el backend de la base.
            const data = await postConfirmarPedido({
                items: items.map((item) => ({ id: item.id, cantidad: item.cantidad })),
            });
            setPedidoConfirmado({ id: data.pedidoId, total: data.total });
            vaciar();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'No pudimos procesar tu pedido. Probá de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    // Pantalla de éxito (va antes del "carrito vacío" porque el carrito ya se vació).
    if (pedidoConfirmado) {
        return (
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
                <CheckCircle size={56} className="text-green-600" />
                <h1 className="text-3xl font-black tracking-tight text-slate-900">¡Pedido confirmado!</h1>
                <p className="text-slate-600">
                    Tu pedido <strong>#{pedidoConfirmado.id}</strong> quedó registrado por un total de{' '}
                    <strong>{formatearPrecio(Number(pedidoConfirmado.total))}</strong>.
                </p>
                <Link
                    to="/productos"
                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                    Seguir comprando
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center text-slate-500">
                <ShoppingCart size={44} />
                <p className="text-lg font-semibold text-slate-700">Tu carrito está vacío.</p>
                <Link
                    to="/productos"
                    className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700"
                >
                    Ver productos
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-10">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Finalizar compra</h1>
            <p className="mt-1 text-sm text-slate-500">Revisá tu pedido antes de continuar.</p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-900">
                        Resumen del pedido ({cantidadTotal} {cantidadTotal === 1 ? 'producto' : 'productos'})
                    </h2>
                </div>

                <ul className="divide-y divide-slate-100 px-5">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4 py-4">
                            {primeraImagen(item.imagen) ? (
                                <img
                                    src={primeraImagen(item.imagen)}
                                    alt={item.nombre}
                                    className="h-16 w-16 shrink-0 rounded-lg border border-slate-100 object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100" />
                            )}

                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold leading-tight text-slate-900">{item.nombre}</p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    {formatearPrecio(item.precio)} × {item.cantidad}
                                </p>
                            </div>

                            <strong className="text-sm text-slate-900">
                                {formatearPrecio(item.precio * item.cantidad)}
                            </strong>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <strong className="text-2xl font-black text-slate-900">{formatearPrecio(total)}</strong>
                </div>
            </div>

            {/* Acceso: si no hay sesión, pedir login o registro; si hay, confirmar el pedido */}
            {usuario ? (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm font-bold text-slate-900">
                                Comprando como {usuario.nombre || usuario.email}
                            </p>
                            <p className="text-xs text-slate-500">Revisá el resumen y confirmá tu pedido.</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleConfirmar}
                            disabled={cargando}
                            className={`rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors ${
                                cargando ? 'cursor-not-allowed bg-slate-400' : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                            {cargando ? 'Procesando tu pedido...' : 'Confirmar pedido'}
                        </button>
                    </div>

                    {error && (
                        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-xs font-bold text-red-600">
                            {error}
                        </p>
                    )}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900">Necesitás una cuenta para comprar</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Iniciá sesión o creá una cuenta. Tu carrito se mantiene.
                    </p>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                        <Link
                            to="/login"
                            state={{ from: '/checkout' }}
                            className="rounded-xl bg-red-600 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-red-700"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            to="/registro"
                            state={{ from: '/checkout' }}
                            className="rounded-xl border border-slate-200 px-6 py-3 text-center text-sm font-bold text-slate-700 transition-colors hover:border-red-300 hover:text-red-600"
                        >
                            Crear cuenta
                        </Link>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <Link to="/productos" className="text-sm font-medium text-red-600 hover:underline">
                    ← Seguir comprando
                </Link>
            </div>
        </div>
    );
}

export default Checkout;