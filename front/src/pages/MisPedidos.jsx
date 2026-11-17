// MisPedidos.jsx - Lista de pedidos del cliente con el estado de cada compra.
import { useEffect, useState } from 'react';
import { obtenerMisPedidos } from '../services/pedidosService.js';
import MenuCuenta from '../components/cuenta/MenuCuenta.jsx';

const ETAPAS = [
    { clave: 'pendiente', etiqueta: 'Recibido' },
    { clave: 'en_preparacion', etiqueta: 'Preparando' },
    { clave: 'enviado', etiqueta: 'Enviado' },
    { clave: 'entregado', etiqueta: 'Entregado' },
];

const ETIQUETAS_ESTADO = {
    pendiente: 'Pendiente',
    en_preparacion: 'En preparación',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
};

const COLORES_ESTADO = {
    pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
    en_preparacion: 'bg-blue-50 text-blue-700 border-blue-200',
    enviado: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    entregado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    cancelado: 'bg-red-50 text-red-700 border-red-200',
};

const formatoPrecio = (valor) =>
    Number(valor).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Barra de progreso: Recibido → Preparando → Enviado → Entregado
function LineaDeTiempo({ estado }) {
    const indiceActual = ETAPAS.findIndex((e) => e.clave === estado);

    return (
        <div className="flex items-center">
            {ETAPAS.map((etapa, i) => {
                const completada = i <= indiceActual;
                return (
                    <div key={etapa.clave} className="flex flex-1 items-center last:flex-none">
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                                    completada ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-400'
                                }`}
                            >
                                {completada ? '✓' : i + 1}
                            </div>
                            <span className={`mt-1 text-[10px] font-medium ${completada ? 'text-slate-800' : 'text-slate-400'}`}>
                                {etapa.etiqueta}
                            </span>
                        </div>
                        {i < ETAPAS.length - 1 && (
                            <div className={`mx-1 mb-4 h-0.5 flex-1 ${i < indiceActual ? 'bg-red-600' : 'bg-slate-200'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function MisPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargar = async () => {
            try {
                setCargando(true);
                const respuesta = await obtenerMisPedidos();
                setPedidos(Array.isArray(respuesta) ? respuesta : respuesta?.data || []);
            } catch (err) {
                console.error('Error al cargar pedidos:', err);
                setError(err.message || 'No se pudieron cargar tus pedidos.');
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, []);

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando tus pedidos...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <MenuCuenta />

            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-600">Mi Cuenta</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Mis pedidos</h1>
                <p className="mt-2 text-sm text-slate-600">Seguí el estado de tus compras.</p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
            )}

            {!error && pedidos.length === 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                    Todavía no hiciste ningún pedido.
                </div>
            )}

            {pedidos.map((pedido) => (
                <div key={pedido.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Pedido #{pedido.id}</p>
                            <p className="text-xs text-slate-500">{formatoFecha(pedido.fecha)}</p>
                        </div>
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${COLORES_ESTADO[pedido.estado] || ''}`}
                        >
                            {ETIQUETAS_ESTADO[pedido.estado] || pedido.estado}
                        </span>
                    </div>

                    {pedido.estado !== 'cancelado' && <LineaDeTiempo estado={pedido.estado} />}

                    <ul className="divide-y divide-slate-100 border-t border-slate-100 pt-2 text-sm">
                        {pedido.productos.map((p) => (
                            <li key={`${pedido.id}-${p.idProducto}`} className="flex justify-between py-2">
                                <span className="text-slate-700">
                                    {p.nombre} <span className="text-slate-400">x{p.cantidad}</span>
                                </span>
                                <span className="font-medium text-slate-900">{formatoPrecio(p.subtotal)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-between border-t border-slate-100 pt-3 text-sm">
                        <span className="font-bold text-slate-700">Total</span>
                        <span className="font-black text-slate-900">{formatoPrecio(pedido.total)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MisPedidos;