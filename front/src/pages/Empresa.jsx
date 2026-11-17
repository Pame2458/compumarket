import { useEffect, useState } from 'react';

function Empresa() {
    // Animación de entrada: empieza oculto y pasa a visible apenas se monta la página
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const entrada = (retraso) =>
        `transition-all duration-700 ease-out ${retraso} ${
            visible ? 'translate-y-0 scale-100 opacity-100 blur-0' : 'translate-y-7 scale-[0.98] opacity-0 blur-sm'
        }`;

    return (
        <div className={`space-y-8 ${entrada('delay-0')}`}>
            {/* Encabezado Institucional - compuMarket */}
            <section>
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">Quiénes Somos</p>
                <h1 className="mb-4 text-4xl font-black text-slate-900 tracking-tight">
                    Sobre compu<span className="text-red-600">Market</span>
                </h1>
                <p className="max-w-3xl text-lg text-slate-600 leading-relaxed">
                    Somos una plataforma especializada en e-commerce de tecnología nacida como un proyecto integrador 
                    para el Instituto Superior Santa Rosa de Calamuchita. Nuestro ecosistema integra interfaces modernas, 
                    arquitectura robusta en Node.js y un modelo de datos MySQL diseñado para gestionar hardware de élite de forma eficiente.
                </p>
            </section>

            {/* Misión y Valores del E-Commerce */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className={entrada('delay-150')}>
                    <article className="h-full rounded-2xl border border-red-500/[.35] bg-slate-950 p-6 shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_16px_35px_rgba(2,6,23,0.75),0_0_25px_rgba(239,68,68,0.35)]">
                        <h2 className="mb-3 text-xl font-bold text-white flex items-center gap-2.5">
                            <span className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></span>
                            Nuestra Misión
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Ofrecer una experiencia de compra digital moderna, ágil y transparente, conectando a entusiastas 
                            del hardware y profesionales con los mejores componentes de tecnología del mercado mediante transacciones seguras.
                        </p>
                    </article>
                </div>

                <div className={entrada('delay-150')}>
                    <article className="h-full rounded-2xl border border-red-500/[.35] bg-slate-950 p-6 shadow-[0_12px_30px_rgba(2,6,23,0.55),0_0_20px_rgba(220,38,38,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:shadow-[0_16px_35px_rgba(2,6,23,0.75),0_0_25px_rgba(239,68,68,0.35)]">
                        <h2 className="mb-3 text-xl font-bold text-white flex items-center gap-2.5">
                            <span className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_10px_#ef4444]"></span>
                            Compromiso Técnico
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Desarrollar soluciones escalables aplicando altos estándares de ingeniería de software: código limpio en React, 
                            estilos eficientes con Tailwind CSS, integridad de datos (ACID) y seguridad mediante tokens JWT.
                        </p>
                    </article>
                </div>
            </section>

            {/* Sección del Equipo (Basado en la Portada del Proyecto) */}
            <section className="border-t border-slate-200 pt-8">
                <h2 className="mb-6 text-2xl font-black text-slate-900 tracking-tight">Equipo de Desarrollo</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { nombre: 'Ana Ibarra' },
                        { nombre: 'Monica Medina' },
                        { nombre: 'Pamela Sacaba' },
                    ].map((integrante) => (
                        <div key={integrante.nombre} className={entrada('delay-300')}>
                            <div className="h-full rounded-xl border border-slate-800 bg-slate-950 p-5 text-center shadow-[0_8px_20px_rgba(2,6,23,0.45)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-red-500 hover:bg-[#090d1e] hover:shadow-[0_12px_28px_rgba(2,6,23,0.7),0_0_20px_rgba(239,68,68,0.35)]">
                                <div className="font-bold text-white text-base">{integrante.nombre}</div>
                                <div className="text-xs text-red-400 font-semibold mt-1 uppercase tracking-wider">Desarrolladora Full Stack</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Empresa;