// ProductosIndex.jsx - Vista introductoria del Catálogo de compuMarket.
// Muestra las categorías y, debajo, todos los productos traídos del backend.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { useCarrito } from '../../context/Carritocontext';
const categoriasTech = [
    {
        to: '/productos/hardware',
        titulo: 'Hardware & Componentes',
        descripcion: 'Placas de video, procesadores multihilo, fuentes certificadas y placas madre para potencia bruta extrema.',
        icono: '⚡',
    },
    {
        to: '/productos/perifericos',
        titulo: 'Periféricos de Élite',
        descripcion: 'Teclados mecánicos hot-swap, mouses ópticos de alta precisión y auriculares con sonido envolvente espacial.',
        icono: '🎧',
    },
    {
        to: '/productos/laptops',
        titulo: 'Laptops Gamer',
        descripcion: 'Notebooks portátiles de alto rendimiento listas para streaming, diseño y productividad profesional.',
        icono: '💻',
    },
];

function ProductosIndex() {
    // Acá guardamos los productos que llegan del backend
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { agregar } = useCarrito();

    // Se ejecuta una vez, cuando se abre la página: le pide los productos al backend
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                // Sin idCategoria => trae productos de todas las categorías
                const respuesta = await api.get('/productos', { params: { pagina: 1, limite: 100 } });

                if (respuesta && respuesta.productos) {
                    setProductos(respuesta.productos);
                } else if (Array.isArray(respuesta)) {
                    setProductos(respuesta);
                }
            } catch (error) {
                console.error('Error al cargar productos:', error);
                setError('No se pudieron cargar los productos.');
            } finally {
                setLoading(false);
            }
        };
        cargarProductos();
    }, []);

           const handleAgregarAlCarrito = (producto) => {
             agregar(producto);
         };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Banner Introductorio con la Identidad de compuMarket */}
            <div className="rounded-2xl border border-red-100 bg-red-50/40 p-6 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Nuestras Divisiones Tecnológicas</h2>
                <p className="mt-1 text-sm text-slate-600 font-medium">
                    Seleccioná una de las siguientes líneas de hardware para explorar nuestro stock disponible en tiempo real con precios integrados.
                </p>
            </div>

            {/* Grilla Comercial de Categorías */}
            <div className="grid gap-6 md:grid-cols-3">
                {categoriasTech.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-red-300 hover:shadow-md"
                    >
                        <div>
                            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-3xl group-hover:bg-red-50 transition-colors duration-200">
                                {item.icono}
                            </div>
                            <h3 className="mt-4 text-base font-black text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
                                {item.titulo}
                            </h3>
                            <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                                {item.descripcion}
                            </p>
                        </div>
                        <span className="mt-5 inline-flex items-center text-xs font-bold text-red-600 tracking-wider uppercase group-hover:underline">
                            Explorar Componentes →
                        </span>
                    </Link>
                ))}
            </div>

            {/* NUEVO: todos los productos */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Todos los Productos</h3>

                {loading ? (
                    <div className="text-center py-10 font-semibold text-slate-400 text-sm animate-pulse">
                        Sincronizando inventario...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                        {error}
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                        <p className="text-sm font-medium text-slate-400">
                            No hay productos cargados actualmente.
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

export default ProductosIndex;