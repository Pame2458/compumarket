function Empresa() {
    return (
        <div className="space-y-8">
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
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="mb-2 text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
                        Nuestra Misión
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Ofrecer una experiencia de compra digital moderna, ágil y transparente, conectando a entusiastas 
                        del hardware y profesionales con los mejores componentes de tecnología del mercado mediante transacciones seguras.
                    </p>
                </article>
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <h2 className="mb-2 text-xl font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-red-600 rounded-full"></span>
                        Compromiso Técnico
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Desarrollar soluciones escalables aplicando altos estándares de ingeniería de software: código limpio en React, 
                        estilos eficientes con Tailwind CSS, integridad de datos (ACID) y seguridad mediante tokens JWT.
                    </p>
                </article>
            </section>

            {/* Sección del Equipo (Basado en la Portada del Proyecto) */}
            <section className="border-t border-slate-200 pt-8">
                <h2 className="mb-6 text-2xl font-black text-slate-900 tracking-tight">Equipo de Desarrollo</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
                        <div className="font-bold text-slate-800 text-base">Julia Garrido</div>
                        <div className="text-xs text-red-600 font-semibold mt-1">Desarrolladora Full Stack</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
                        <div className="font-bold text-slate-800 text-base">Monica Medina</div>
                        <div className="text-xs text-red-600 font-semibold mt-1">Desarrolladora Full Stack</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center">
                        <div className="font-bold text-slate-800 text-base">Pamela Sacaba</div>
                        <div className="text-xs text-red-600 font-semibold mt-1">Desarrolladora Full Stack</div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Empresa;
