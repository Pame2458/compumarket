import { useEffect } from "react";
import { Minus, Plus, Trash2, X, ShoppingCart } from "lucide-react";
import { useCarrito } from "../context/Carritocontext";

// Mismo prefijo que uses en el detalle de producto (ej: "http://localhost:3000")
const URL_IMAGENES = "";

const formatearPrecio = (n) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function CarritoFlotante({ onFinalizar }) {
  const { items, abierto, cerrar, sumar, restar, eliminar, vaciar, total, cantidadTotal } =
    useCarrito();

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e) => e.key === "Escape" && cerrar();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, cerrar]);

  return (
    <>
      {/* Fondo oscuro */}
      <div
        onClick={cerrar}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-slate-900/50 transition-opacity duration-300 motion-reduce:transition-none ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel lateral */}
      <aside
        role="dialog"
        aria-label="Carrito de compras"
        aria-hidden={!abierto}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 motion-reduce:transition-none ${
          abierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            Tu carrito ({cantidadTotal})
          </h2>
          <button
            onClick={cerrar}
            aria-label="Cerrar carrito"
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-slate-500">
            <ShoppingCart size={40} />
            <p className="text-sm font-medium">Todavía no agregaste productos.</p>
            <button
              onClick={cerrar}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-red-300 hover:text-red-600"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-slate-100 overflow-y-auto px-5">
              {items.map((item) => (
                <li key={item.id} className="grid grid-cols-[64px_1fr_auto] gap-3 py-4">
                  {item.imagen ? (
                    <img
                      src={`${URL_IMAGENES}${item.imagen}`}
                      alt={item.nombre}
                      className="h-16 w-16 rounded-lg border border-slate-100 object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-slate-100" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-bold leading-tight text-slate-900">{item.nombre}</p>
                    <p className="mb-2 mt-0.5 text-xs font-medium text-slate-500">
                      {formatearPrecio(item.precio)}
                    </p>

                    <div className="inline-flex items-center rounded-lg border border-slate-200">
                      <button
                        onClick={() => restar(item.id)}
                        disabled={item.cantidad <= 1}
                        aria-label={`Restar una unidad de ${item.nombre}`}
                        className="p-1.5 text-slate-700 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[28px] text-center text-sm font-bold text-slate-900">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => sumar(item.id)}
                        disabled={item.stock != null && item.cantidad >= item.stock}
                        aria-label={`Sumar una unidad de ${item.nombre}`}
                        className="p-1.5 text-slate-700 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => eliminar(item.id)}
                      aria-label={`Quitar ${item.nombre} del carrito`}
                      className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                    <strong className="text-sm text-slate-900">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </strong>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="space-y-2 border-t border-slate-200 px-5 pb-5 pt-4">
              <div className="mb-2 flex items-center justify-between text-slate-900">
                <span className="text-sm font-bold">Total</span>
                <strong className="text-xl font-black">{formatearPrecio(total)}</strong>
              </div>
              <button
                onClick={() => onFinalizar?.()}
                className="w-full rounded-xl bg-red-600 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Finalizar compra
              </button>
              <button
                onClick={vaciar}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-red-300 hover:text-red-600"
              >
                Vaciar carrito
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}