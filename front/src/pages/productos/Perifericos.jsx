// Perifericos.jsx - Sección de Periféricos Gamer de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.

import { useState, useEffect } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard';

function Perifericos() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarPerifericos = async () => {
            try {
                // Según tu DER, filtramos por el ID correspondiente a Periféricos (Ej: ID 2)
                const respuesta = await api.get('/productos?idCategoria=2');
                
                    setProductos(respuesta);
                
            } catch (error) {
                console.error("Error al cargar periféricos desde MySQL:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarPerifericos();
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
                        🎧
                    </span>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Periféricos de Élite</h2>
                        <p className="text-sm font-semibold text-slate-500">
                            Equipamiento competitivo y de alta fidelidad para setups profesionales.
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                    Maximizá tu rendimiento con periféricos seleccionados por su precisión y durabilidad. 
                    Nuestra tienda sincroniza en tiempo real el stock de teclados mecánicos, mouses ópticos de alta tasa de sondeo y auriculares con sonido espacial, validados bajo rigurosos estándares de calidad.
                </p>

                {/* Sub-bloques informativos técnicos */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Audio y Sonido Espacial
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Auriculares con drivers de neodimio y micrófonos con cancelación de ruido pasiva optimizados para juego táctico.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Precisión Mecánica
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Teclados con switches intercambiables en caliente (Hot-swap) y mouses ultralivianos con sensores de última generación.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grilla Dinámica con Productos Reales del Backend */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Artículos Disponibles</h3>
                
                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Cargando catálogo de periféricos...
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            No hay periféricos cargados en esta categoría actualmente.
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

export default Perifericos;

