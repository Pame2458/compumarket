// MisResenas.jsx - Mis reseñas: calificar productos entregados y ver las reseñas ya enviadas.
import { useEffect, useState } from 'react';
import { obtenerMisResenas, crearCalificacion } from '../services/calificacionesService.js';
import MenuCuenta from '../components/cuenta/MenuCuenta.jsx';

const ETIQUETAS_ESTADO = {
    pendiente: 'En revisión',
    aprobada: 'Publicada',
    rechazada: 'Rechazada',
};

const COLORES_ESTADO = {
    pendiente: 'bg-amber-50 text-amber-700 border-amber-200',
    aprobada: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rechazada: 'bg-red-50 text-red-700 border-red-200',
};

const ETIQUETAS_MOTIVO = {
    ofensivo: 'contenido ofensivo',
    spam: 'spam',
    no_relacionado: 'no relacionado con el producto',
};

const formatoFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

// Estrellas de solo lectura.
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

// Tarjeta para calificar un producto entregado: estrellas + comentario opcional.
function TarjetaCalificar({ producto, onEnviado }) {
    const [puntaje, setPuntaje] = useState(0);
    const [comentario, setComentario] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const handleEnviar = async () => {
        if (puntaje < 1) {
            setError('Elegí de 1 a 5 estrellas.');
            return;
        }

        setEnviando(true);
        setError('');
        try {
            await crearCalificacion({
                idProducto: producto.idProducto,
                puntaje,
                comentario,
            });
            onEnviado(); // recarga las listas
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.mensaje || err.message || 'No pudimos guardar tu calificación.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-900">{producto.nombre}</p>

            <div className="flex items-center gap-1" role="radiogroup" aria-label="Puntaje">
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => setPuntaje(n)}
                        aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                        className={`text-3xl transition ${
                            n <= puntaje ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'
                        }`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Contanos tu experiencia (opcional)"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-red-400"
            />
            <p className="text-right text-xs text-slate-400">{comentario.length}/500</p>

            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600">{error}</p>
            )}

            <button
                type="button"
                onClick={handleEnviar}
                disabled={enviando}
                className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors ${
                    enviando ? 'cursor-not-allowed bg-slate-400' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {enviando ? 'Enviando...' : 'Enviar calificación'}
            </button>
        </div>
    );
}

function MisResenas() {
    const [porCalificar, setPorCalificar] = useState([]);
    const [calificadas, setCalificadas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const cargar = async () => {
        try {
            const respuesta = await obtenerMisResenas();
            setPorCalificar(respuesta.porCalificar || []);
            setCalificadas(respuesta.calificadas || []);
            setError('');
        } catch (err) {
            console.error('Error al cargar reseñas:', err);
            setError(err.response?.data?.mensaje || err.message || 'No se pudieron cargar tus reseñas.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargar();
    }, []);

    if (cargando) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Cargando tus reseñas...</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <MenuCuenta />

            <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-red-600">Mi Cuenta</p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">Mis reseñas</h1>
                <p className="mt-2 text-sm text-slate-600">
                    Calificá los productos que ya te entregamos y mirá el estado de tus opiniones.
                </p>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
            )}

            {/* Productos entregados que todavía no calificó */}
            <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">Para calificar</h2>
                {porCalificar.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
                        No tenés productos pendientes de calificar.
                    </div>
                ) : (
                    porCalificar.map((p) => (
                        <TarjetaCalificar key={p.idProducto} producto={p} onEnviado={cargar} />
                    ))
                )}
            </section>

            {/* Reseñas que ya envió */}
            <section className="space-y-3">
                <h2 className="text-lg font-bold text-slate-900">Mis calificaciones</h2>
                {calificadas.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
                        Todavía no calificaste ningún producto.
                    </div>
                ) : (
                    calificadas.map((c) => (
                        <div key={c.id} className="space-y-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-900">{c.nombre}</p>
                                {c.comentario && (
                                    <span
                                        className={`rounded-full border px-3 py-1 text-xs font-bold ${COLORES_ESTADO[c.estado] || ''}`}
                                    >
                                        {ETIQUETAS_ESTADO[c.estado] || c.estado}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <Estrellas puntaje={c.puntaje} />
                                <span className="text-xs text-slate-400">{formatoFecha(c.fecha)}</span>
                            </div>

                            {c.comentario && <p className="text-sm text-slate-700">{c.comentario}</p>}

                            {c.estado === 'rechazada' && (
                                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                                    Tu comentario no se publicó por: {ETIQUETAS_MOTIVO[c.motivoRechazo] || 'incumplir las normas'}.
                                    Tus estrellas sí cuentan en la calificación del producto.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}

export default MisResenas;