// AdminResenas.jsx - Moderación de comentarios de reseñas del panel de administración.
// - Pestañas por estado: pendientes, aprobadas y rechazadas.
// - Aprobar un comentario (tilde), o rechazarlo (cruz) eligiendo un motivo obligatorio.
// Las estrellas siempre cuentan en el promedio: solo se modera el texto.

import { useEffect, useState, useCallback } from 'react';
import { Check, X } from 'lucide-react'; // CAMBIO: íconos para las acciones
import { listarCalificacionesAdmin, moderarCalificacionAdmin } from '../../services/adminService.js';

const PESTANAS = [
    { valor: 'pendiente', etiqueta: 'Pendientes' },
    { valor: 'aprobada', etiqueta: 'Aprobadas' },
    { valor: 'rechazada', etiqueta: 'Rechazadas' },
];

const MOTIVOS = [
    { valor: 'ofensivo', etiqueta: 'Ofensivo' },
    { valor: 'spam', etiqueta: 'Spam' },
    { valor: 'no_relacionado', etiqueta: 'No relacionado con el producto' },
];

const etiquetaMotivo = (valor) => MOTIVOS.find((m) => m.valor === valor)?.etiqueta || valor;

const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
};

function Estrellas({ puntaje }) {
    return (
        <span className="inline-flex text-base" aria-label={`${puntaje} de 5 estrellas`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className={n <= puntaje ? 'text-amber-400' : 'text-slate-300'}>
                    ★
                </span>
            ))}
        </span>
    );
}

function AdminResenas() {
    const [filtroEstado, setFiltroEstado] = useState('pendiente');
    const [resenas, setResenas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Reseña que se está por rechazar (muestra el selector de motivo) y el motivo elegido
    const [rechazandoId, setRechazandoId] = useState(null);
    const [motivo, setMotivo] = useState('');
    const [procesandoId, setProcesandoId] = useState(null);

    const cargarResenas = useCallback(async () => {
        try {
            setCargando(true);
            setError('');
            const respuesta = await listarCalificacionesAdmin({ estado: filtroEstado });
            // adminApi puede devolver la lista sola o { data: [...] }; aceptamos las dos formas.
            setResenas(Array.isArray(respuesta) ? respuesta : respuesta?.data || []);
        } catch (err) {
            setError(err.message || 'Error al cargar las reseñas.');
        } finally {
            setCargando(false);
        }
    }, [filtroEstado]);

    useEffect(() => {
        cargarResenas();
    }, [cargarResenas]);

    const cambiarPestana = (valor) => {
        setFiltroEstado(valor);
        setRechazandoId(null);
        setMotivo('');
        setMensaje('');
    };

    const nombreCliente = (r) => {
        const c = r.Cliente;
        if (!c) return `Cliente #${r.idCliente}`;
        return `${c.nombre || ''} ${c.apellido || ''}`.trim() || `Cliente #${r.idCliente}`;
    };

    // Aprueba o rechaza un comentario y lo saca de la lista actual.
    const moderar = async (id, estado, motivoRechazo) => {
        setError('');
        setMensaje('');
        setProcesandoId(id);
        try {
            await moderarCalificacionAdmin(id, estado, motivoRechazo);
            setResenas((prev) => prev.filter((r) => r.id !== id));
            setRechazandoId(null);
            setMotivo('');
            setMensaje(estado === 'aprobada' ? 'Comentario aprobado.' : 'Comentario rechazado.');
        } catch (err) {
            setError(err.message || 'No se pudo moderar el comentario.');
        } finally {
            setProcesandoId(null);
        }
    };

    const handleConfirmarRechazo = (id) => {
        if (!motivo) {
            setError('Elegí un motivo para rechazar el comentario.');
            return;
        }
        moderar(id, 'rechazada', motivo);
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Reseñas</h2>
                <p className="text-sm text-slate-600">
                    Revisá los comentarios de los clientes. Se rechazan solo los ofensivos, el spam o los que no tienen que ver
                    con el producto. Una crítica respetuosa, aunque sea negativa, se aprueba. Las estrellas siempre cuentan.
                </p>
            </div>

            {/* Mensajes */}
            {mensaje && (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-blue-50 p-4 text-sm font-medium text-emerald-800">
                    <span>{mensaje}</span>
                    <button onClick={() => setMensaje('')} className="text-emerald-600 hover:text-emerald-900">×</button>
                </div>
            )}
            {error && (
                <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-600 hover:text-red-900">×</button>
                </div>
            )}

            {/* Pestañas por estado */}
            <div className="flex gap-2 border-b border-slate-200">
                {PESTANAS.map((p) => (
                    <button
                        key={p.valor}
                        type="button"
                        onClick={() => cambiarPestana(p.valor)}
                        className={`-mb-px border-b-2 px-4 py-2 text-sm font-bold transition ${
                            filtroEstado === p.valor
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {p.etiqueta}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {cargando ? (
                <p className="py-10 text-center text-sm font-medium text-slate-500">Cargando reseñas...</p>
            ) : resenas.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                    <p className="text-base font-semibold text-slate-700">No hay comentarios en esta sección</p>
                    <p className="text-xs text-slate-400">
                        {filtroEstado === 'pendiente'
                            ? 'Cuando un cliente deje un comentario, va a aparecer acá para que lo revises.'
                            : 'Todavía no hay comentarios en este estado.'}
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {resenas.map((r) => (
                        <li key={r.id} className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{r.nombreProducto}</p>
                                    <p className="text-xs text-slate-500">
                                        {nombreCliente(r)} · {formatearFecha(r.fecha)}
                                    </p>
                                </div>
                                <Estrellas puntaje={r.puntaje} />
                            </div>

                            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-800">{r.comentario}</p>

                            {r.estado === 'rechazada' && r.motivoRechazo && (
                                <p className="text-xs font-semibold text-red-600">
                                    Motivo del rechazo: {etiquetaMotivo(r.motivoRechazo)}
                                </p>
                            )}

                            {/* CAMBIO: acciones con íconos (tilde y cruz) */}
                            {rechazandoId === r.id ? (
                                <div className="flex flex-wrap items-center gap-2">
                                    <select
                                        value={motivo}
                                        onChange={(e) => setMotivo(e.target.value)}
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none"
                                    >
                                        <option value="">Elegí un motivo...</option>
                                        {MOTIVOS.map((m) => (
                                            <option key={m.valor} value={m.valor}>{m.etiqueta}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleConfirmarRechazo(r.id)}
                                        disabled={procesandoId === r.id}
                                        title="Confirmar rechazo"
                                        aria-label="Confirmar rechazo"
                                        className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setRechazandoId(null); setMotivo(''); }}
                                        title="Cancelar"
                                        aria-label="Cancelar"
                                        className="rounded-lg border border-slate-300 p-2 text-slate-600 transition hover:bg-slate-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {r.estado !== 'aprobada' && (
                                        <button
                                            type="button"
                                            onClick={() => moderar(r.id, 'aprobada')}
                                            disabled={procesandoId === r.id}
                                            title="Aprobar comentario"
                                            aria-label="Aprobar comentario"
                                            className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                                        >
                                            <Check size={18} />
                                        </button>
                                    )}
                                    {r.estado !== 'rechazada' && (
                                        <button
                                            type="button"
                                            onClick={() => { setRechazandoId(r.id); setMotivo(''); setError(''); }}
                                            title="Rechazar comentario"
                                            aria-label="Rechazar comentario"
                                            className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50"
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AdminResenas;