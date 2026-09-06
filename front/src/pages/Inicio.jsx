import { Link } from 'react-router-dom';

function Inicio() {
    return (
        <div className="space-y-10">
            {/* Hero Section - compuMarket */}
            <section className="rounded-3xl bg-slate-900 px-8 py-16 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden md:block">
                    <span className="text-9xl font-black"></span>
                </div>
                <p className="mb-3 text-sm uppercase tracking-[0.2em] text-red-400 font-bold">E-Commerce de Tecnología</p>
                <h1 className="mb-4 text-4xl font-black text-white md:text-5xl tracking-tight">
                    Bienvenidos a compu<span className="text-red-600">Market</span>
                </h1>
                <p className="max-w-2xl text-lg text-slate-300">
                    Tu plataforma líder en hardware de elite, componentes de alto rendimiento y periféricos seleccionados para entusiastas.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/productos" className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 transition duration-200 shadow-md">
                        Ver Catálogo
                    </Link>
                    <Link to="/contacto" className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/20 transition duration-200">
                        Soporte Técnico
                    </Link>
                </div>
            </section>

            {/* Grid Informativo basado en tu Negocio y DER */}
            <section className="grid gap-6 md:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="text-red-600 mb-2 font-bold text-xs uppercase tracking-wide">Marcas Oficiales</div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Hardware de Élite</h2>
                        <p className="text-slate-600 text-sm">Trabajamos únicamente con marcas líderes verificadas en nuestro sistema para garantizar componentes originales y garantía oficial.</p>
                    </div>
                    <Link to="/productos" className="mt-4 text-sm font-bold text-red-600 hover:text-red-700 inline-block">
                        Explorar marcas →
                    </Link>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="text-red-600 mb-2 font-bold text-xs uppercase tracking-wide">Envíos Seguros</div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Logística Integrada</h2>
                        <p className="text-slate-600 text-sm">Seguimiento en tiempo real de tus pedidos vinculados directamente a tu domicilio con soporte para MercadoPago y tarjetas.</p>
                    </div>
                    <Link to="/ayuda" className="mt-4 text-sm font-bold text-red-600 hover:text-red-700 inline-block">
                        Métodos de envío →
                    </Link>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="text-red-600 mb-2 font-bold text-xs uppercase tracking-wide">Tu Espacio</div>
                        <h2 className="mb-2 text-xl font-bold text-slate-900">Panel de Cliente</h2>
                        <p className="text-slate-600 text-sm">Gestioná tu carrito de compras activo, revisá el historial de tus pedidos completados y calificá el rendimiento de tus componentes.</p>
                    </div>
                    <Link to="/login" className="mt-4 text-sm font-bold text-red-600 hover:text-red-700 inline-block">
                        Ingresar a mi cuenta →
                    </Link>
                </article>
            </section>
        </div>
    );
}

export default Inicio;
