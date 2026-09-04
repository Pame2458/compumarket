// LaptopsNotebooks.jsx - Sección de Laptops y Notebooks de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.

import { useState, useEffect } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard'; // Componente para mostrar cada producto

function LaptopsNotebooks() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarLaptops = async () => {
            try {
                // Según tu DER, filtramos por el ID correspondiente a Laptops/Notebooks (Ej: ID 3)
                const respuesta = await api.get('/productos?idCategoria=3');
                if (respuesta.data.estado) {
                    setProductos(respuesta.data.data);
                }
            } catch (error) {
                console.error("Error al cargar laptops desde MySQL:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarLaptops();
    }, []);

    const handleAgregarAlCarrito = (producto) => {
        console.log("Añadiendo a la tabla CarritoItem el producto ID:", producto.id);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Banner Descriptivo de la Categoría */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                    {/* Estética unificada con el rojo corporativo compuMarket */}
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl text-red-600">
                        💻
                    </span>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Laptops & Notebooks</h2>
                        <p className="text-sm font-semibold text-slate-500">
                            Equipos portátiles de alto rendimiento para gaming, diseño y productividad extrema
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                    Rendimiento sin límites vayas donde vayas. Nuestra plataforma sincroniza de forma directa el stock de laptops de última generación, equipadas con pantallas de alta tasa de refresco, procesadores avanzados y soluciones térmicas de vanguardia para máxima exigencia profesional.
                </p>

                {/* Sub-bloques informativos técnicos */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Poder Gamer Portátil
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Equipos equipados con placas gráficas dedicadas de última serie y pantallas fluidas ideales para eSports y trazado de rayos en tiempo real.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Estaciones de Trabajo Móviles
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Máxima autonomía y pantallas de alta fidelidad cromática calibradas de fábrica, optimizadas para desarrollo, arquitectura y edición de video.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grilla Dinámica con Productos Reales del Backend */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Modelos Disponibles</h3>
                
                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Sincronizando inventario de notebooks...
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            No hay equipos cargados en esta categoría actualmente.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {productos.map((prod) => (
                            <ProductCard 
                                key={prod.id} 
                                producto={prod} 
                                onAgregarAlCarrito={handleAgregarAlCarrito} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default LaptopsNotebooks;
