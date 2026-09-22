import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import video from "../components/assets/video.mp4";

function Inicio() {
    return (
        <div className="space-y-10">
            {/* Hero Section - compuMarket */}
            <section className="relative rounded-3xl bg-slate-900 px-8 py-16 text-white shadow-xl overflow-hidden">
                
                {/* Video de fondo */}
                <video
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />

                {/* Capa oscura para mejorar contraste */}
                <div className="absolute inset-0 bg-slate-900/60"></div>

                {/* Contenido encima del video */}
                <div className="relative z-10">
                    <p className="mb-3 text-sm uppercase tracking-[0.2em] text-red-400 font-bold">
                        E-Commerce de Tecnología
                    </p>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        whileHover={{ scale: 1.05, color: "#f87171" }}
                        className="mb-4 text-4xl font-black text-white md:text-5xl tracking-tight"
                    >
                        Bienvenidos a Compu
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-red-700"
                        >
                            Market
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="max-w-2xl text-lg text-slate-300"
                    >
                        Tu plataforma líder en hardware de elite, componentes de alto rendimiento y periféricos seleccionados para entusiastas.
                    </motion.p>

                    <div className="mt-8 flex flex-wrap gap-3 justify-end">
                        <Link to="/productos" className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 transition duration-200 shadow-md">
                            Ver Catálogo
                        </Link>
                        <Link to="/contacto" className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white hover:bg-white/20 transition duration-200">
                            Soporte Técnico
                        </Link>
                    </div>
                </div>
            </section>

            {/* Grid Informativo */}
            <section className="grid gap-6 md:grid-cols-3">
                {/* ... tus artículos informativos ... */}
            </section>
        </div>
    );
}

export default Inicio;
