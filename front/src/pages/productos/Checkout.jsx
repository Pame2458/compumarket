// Checkout.jsx - Página de finalizar compra (paso 1: resumen del pedido).

import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCarrito } from '../../context/Carritocontext';
import { useAuth } from '../../context/AuthContext.jsx';

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
    const { items, total, cantidadTotal } = useCarrito();
    const { user } = useAuth(); // null si el cliente no inició sesión
    const navigate = useNavigate();

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

            {/* Acceso: si no hay sesión, pedir login o registro; si hay, seguir al pago */}
            {user ? (
                <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-900">
                            Comprando como {user.nombre || user.email}
                        </p>
                        <p className="text-xs text-slate-500">Todo listo para continuar con el pago.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/pago')}
                        className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
                    >
                        Continuar al pago
                    </button>
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