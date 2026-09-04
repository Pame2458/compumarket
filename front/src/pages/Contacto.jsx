import { useState } from 'react';

function Contacto() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos listos para enviar a tu API de Express:", formData);
        // Aquí conectarás luego con tu ruta del backend utilizando Axios:
        // api.post('/contacto', formData)
        alert('¡Consulta recibida! Nos comunicaremos a la brevedad.');
    };

    return (
        <div className="space-y-8">
            {/* Encabezado del Módulo */}
            <section>
                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-red-600">Soporte y Consultas</p>
                <h1 className="mb-4 text-4xl font-black text-slate-900 tracking-tight">Contacto</h1>
                <p className="max-w-3xl text-lg text-slate-600 leading-relaxed">
                    ¿Tenés dudas sobre compatibilidad de hardware o necesitas asistencia con tu pedido? Escribinos y nuestro equipo de soporte técnico te asesorará.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
                {/* Formulario Reactivo */}
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <label className="mb-1 block text-sm font-bold text-slate-700">Nombre</label>
                        <input 
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                            placeholder="Tu nombre completo" 
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold text-slate-700">Email Corporativo / Personal</label>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                            placeholder="tu@email.com" 
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-bold text-slate-700">Mensaje o Consulta</label>
                        <textarea 
                            name="mensaje"
                            value={formData.mensaje}
                            onChange={handleChange}
                            required
                            className="min-h-28 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition" 
                            placeholder="Detallá los componentes o tu número de pedido..." 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 active:bg-red-800 transition duration-200 shadow-md text-sm w-full sm:w-auto"
                    >
                        Enviar consulta
                    </button>
                </form>

                {/* Datos reales extraídos de los Wireframes del PDF */}
                <aside className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl flex flex-col justify-between">
                    <div>
                        <h2 className="mb-4 text-xl font-black text-white tracking-tight border-b border-slate-800 pb-2">
                            Canales Oficiales
                        </h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Dirección</p>
                                <p className="text-slate-200">Av. Cabildo 2500, CABA</p>
                            </div>
                            <div>
                                <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Teléfono de atención</p>
                                <p className="text-slate-200">0800-444-HARDWARE (4273)</p>
                            </div>
                            <div>
                                <p className="text-red-400 font-bold uppercase text-[11px] tracking-wider">Correo electrónico</p>
                                <p className="text-slate-200">ventas@compumarket.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-slate-800 pt-4 text-xs text-slate-400 leading-relaxed">
                        <p className="font-semibold text-slate-300">Horarios de Soporte:</p>
                        <p>Lunes a viernes de 09:00 a 18:00 hs.</p>
                        <p>Sábados de 09:00 a 13:00 hs.</p>
                    </div>
                </aside>
            </section>
        </div>
    );
}

export default Contacto;
