// Productos.jsx - Componente padre que aloja las rutas hijas del catálogo mediante <Outlet />.

import { NavLink, Outlet } from 'react-router-dom';

// Mapeado según las categorías de productos tecnológicas de tu DER y Wireframes
const categoriasHardware = [
    { to: '/productos', label: 'Todos los Productos', end: true },
    { to: '/productos/hardware', label: 'Hardware & Componentes' },
    { to: '/productos/perifericos', label: 'Periféricos' },
    { to: '/productos/laptops', label: 'Laptops & Notebooks' },
];

function Productos() {
    // Estilos de pestañas adaptados al color Rojo de compuMarket
    const tabClass = ({ isActive }) =>
        `rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 ${isActive
            ? 'bg-red-600 text-white shadow-md'
            : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
        }`;

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Encabezado de la Sección de Catálogo / Líneas de Tecnología */}
            <div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-600">Líneas de Tecnología</p>
                <h1 className="mt-1 text-4xl font-black text-slate-900 tracking-tight">Componentes de Élite</h1>
                <p className="mt-2 max-w-3xl text-base text-slate-600 leading-relaxed">
                    Explorá nuestras divisiones de hardware de alto rendimiento. Filtrá por categorías vinculadas directamente a nuestro inventario en tiempo real.
                </p>
            </div>

            {/* Submenú de pestañas para navegar entre rutas hijas relacionales */}
            <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                {categoriasHardware.map((cat) => (
                    <NavLink
                        key={cat.to}
                        to={cat.to}
                        end={cat.end}
                        className={tabClass}
                    >
                        {cat.label}
                    </NavLink>
                ))}
            </nav>

            {/* El <Outlet /> renderizará dinámicamente las listas filtradas de tu base de datos */}
            <div className="pt-2">
                <Outlet />
            </div>
        </div>
    );
}

export default Productos;
