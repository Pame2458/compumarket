import { useEffect, useState } from 'react';

function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const entrada = (estadoInicial, retraso) =>
        `transition-all duration-700 ease-out ${retraso} ${
            visible ? 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0' : `${estadoInicial} opacity-0`
        }`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos listos para enviar a tu API de Express:", formData);
        alert('¡Consulta recibida! Nos comunicaremos a la brevedad.');
    };

    // Estilos compartidos por los campos del formulario
    const labelClase = 'mb-1.5 block text-sm font-bold text-slate-200';
    const inputClase =
        'w-full rounded-[10px] border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-red-500 focus:bg-[#131c31] focus:shadow-[0_0_15px_rgba(239,68,68,0.4)]';

    return (
        <div className={`space-y-8 ${entrada('translate-y-7 scale-[0.98] blur-sm', 'delay-0')}`}>
            {/* Encabezado del Módulo */}
            <section>
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">Soporte y Consultas</p>
                <h1 className="mb-4 text-4xl font-black text-slate-900 tracking-tight">Contacto</h1>
                <p className="max-w-3xl text-lg text-slate-600 leading-relaxed">
                    ¿Tenés dudas sobre compatibilidad de hardware o necesitas asistencia con tu pedido? Escribinos y nuestro equipo de soporte técnico te asesorará.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                {/* Formulario Reactivo en Modo Oscuro Gamer */}
                <div className={entrada('translate-y-7 scale-[0.98] blur-sm', 'delay-100')}>
                    <form
                        onSubmit={handleSubmit}
                        className="h-full space-y-4 rounded-2xl border border-red-500/[.35] bg-slate-950 p-6 shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:border-red-500/[.7] hover:shadow-[0_16px_35px_rgba(2,6,23,0.7),0_0_25px_rgba(239,68,68,0.25)]"
                    >
                        <div>
                            <label className={labelClase}>Nombre</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                className={inputClase}
                                placeholder="Tu nombre completo"
                            />
                        </div>
                        <div>
                            <label className={labelClase}>Email Corporativo / Personal</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClase}
                                placeholder="tu@email.com"
                            />
                        </div>
                        <div>
                            <label className={labelClase}>Mensaje o Consulta</label>
                            <textarea
                                name="mensaje"
                                value={formData.mensaje}
                                onChange={handleChange}
                                required
                                className={`${inputClase} min-h-28`}
                                placeholder="Detallá los componentes o tu número de pedido..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full cursor-pointer rounded-xl border border-red-500 bg-red-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-red-500 hover:shadow-[0_0_22px_rgba(239,68,68,0.75)] sm:w-auto"
                        >
                            Enviar consulta
                        </button>
                    </form>
                </div>

                {/* Panel lateral Canales Oficiales */}
                <div className={entrada('translate-x-9', 'delay-200')}>
                    <aside className="flex h-full flex-col justify-between rounded-2xl border border-red-500/[.35] bg-slate-950 p-6 text-white shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_16px_35px_rgba(2,6,23,0.7),0_0_25px_rgba(239,68,68,0.35)]">
                        <div>
                            <h2 className="mb-4 text-xl font-black text-white tracking-tight border-b border-slate-800 pb-2">
                                Canales Oficiales
                            </h2>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Dirección</p>
                                    <p className="text-slate-200">📍 Av. Cabildo 2500, CABA</p>
                                </div>
                                <div>
                                    <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Teléfono de atención</p>
                                    <p className="text-slate-200">📞 0800-444-HARDWARE (4273)</p>
                                </div>
                                <div>
                                    <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Correo electrónico</p>
                                    <p className="text-slate-200">📧 ventas@compumarket.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400 leading-relaxed">
                            <p className="font-semibold text-slate-300">Horarios de Soporte:</p>
                            <p>Lunes a viernes de 09:00 a 18:00 hs.</p>
                            <p>Sábados de 09:00 a 13:00 hs.</p>
                        </div>
                    </aside>
                </div>
            </section>
        </div>
    );
}

export default Contacto;