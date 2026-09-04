// HardwareComponentes.jsx - Sección de Hardware y Componentes de Élite para compuMarket.
// Consulta dinámicamente el backend filtrando por la categoría correspondiente del DER.

import { useState, useEffect } from 'react';
import api from '../../services/api'; // Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import ProductCard from '../../components/ProductCard';

function HardwareComponentes() {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

 useEffect(() => {
    const cargarHardware = async () => {
        try {
            const respuesta = await api.get('/productos?idCategoria=1');
            setProductos(respuesta); // respuesta ya es el array
        } catch (error) {
            console.error("Error al cargar componentes de hardware desde MySQL:", error);
        } finally {
            setLoading(false);
        }
    };
    cargarHardware();
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
                        ⚡
                    </span>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hardware & Componentes</h2>
                        <p className="text-sm font-semibold text-slate-500">
                            Potencia bruta, estabilidad y rendimiento de última generación para tu setup
                        </p>
                    </div>
                </div>

                <p className="text-slate-600 leading-relaxed text-sm">
                    Llevá tu computadora al límite con componentes internos seleccionados para máxima exigencia. 
                    Nuestra plataforma se sincroniza de forma directa con el inventario para listar placas de video avanzadas, procesadores multihilo y memorias de alta frecuencia con integridad garantizada.
                </p>

                {/* Sub-bloques informativos técnicos */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Procesamiento Gráfico Extremo
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Placas de video optimizadas para trazado de rayos (Ray Tracing), renderizado 3D y streaming en alta resolución sin caídas de cuadros.
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                            Arquitecturas de Alta Eficiencia
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            Procesadores y placas madre con soporte para PCIe 5.0 y memorias DDR5, asegurando ancho de banda y velocidad crítica.
                        </p>
                    </div>
                </div>
            </div>

            {/* Grilla Dinámica con Productos Reales de la Base de Datos */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Componentes en Stock</h3>
                
                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Consultando inventario de hardware...
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            No hay componentes cargados en esta categoría actualmente.
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

export default HardwareComponentes;

