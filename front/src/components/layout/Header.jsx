// Header.jsx es la cabecera del sitio compuMarket.
import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const subCategorias = [
    { to: '/productos', label: 'Todos los productos', end: true, desc: 'Ver todo nuestro stock de hardware' },
    { to: '/productos/hardware', label: 'Hardware & Componentes', desc: 'Placas de video, procesadores y fuentes' },
    { to: '/productos/perifericos', label: 'Periféricos de Élite', desc: 'Teclados mecánicos, mouses y audio gamer' },
    { to: '/productos/laptops', label: 'Laptops Gamer', desc: 'Notebooks listas para alta fidelidad y specs' },
];

function Header() {
    const [abierto, setAbierto] = useState(false);
    const [productosAbierto, setProductosAbierto] = useState(false);
    const dropdownRef = useRef(null);
    const location = useLocation();

    const { usuario, isAuthenticated, logout } = useAuth();
    const estaEnProductos = location.pathname.startsWith('/productos');

    // SOLUCIÓN SENIOR: Almacenamos la última ruta renderizada para cerrar los menús sincrónicamente
    const [lastPath, setLastPath] = useState(location.pathname);
    if (location.pathname !== lastPath) {
        setLastPath(location.pathname);
        setProductosAbierto(false);
        setAbierto(false);
    }

    // Cerrar el dropdown al hacer click fuera (Mantiene la sincronización externa válida)
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setProductosAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    const navClass = ({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-bold transition duration-200 ${isActive
            ? 'bg-red-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`;

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <NavLink to="/" className="flex items-center gap-1.5 text-lg font-black tracking-tight text-slate-900">
                    compu<span className="text-red-600">Market</span>
                </NavLink>

                <button
                    type="button"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 md:hidden hover:bg-slate-50 transition"
                    onClick={() => setAbierto(!abierto)}
                >
                    {abierto ? 'Cerrar' : 'Menú'}
                </button>

                <nav className={`${abierto ? 'flex flex-col absolute top-16 left-0 w-full bg-white p-4 border-b border-slate-200 gap-2 md:static md:w-auto md:p-0 md:border-none md:bg-transparent' : 'hidden'} items-center gap-1 md:flex`}>
                    <NavLink to="/" className={navClass} end>Inicio</NavLink>
                    <NavLink to="/empresa" className={navClass}>Nosotros</NavLink>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setProductosAbierto(!productosAbierto)}
                            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition duration-200 ${estaEnProductos || productosAbierto ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            <span>Productos</span>
                            <svg className={`h-4 w-4 transition-transform duration-200 ${productosAbierto ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {productosAbierto && (
                            <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nuestras Categorías</p>
                                {subCategorias.map((sub) => (
                                    <NavLink
                                        key={sub.to} to={sub.to} end={sub.end}
                                        onClick={() => setProductosAbierto(false)}
                                        className={({ isActive }) => `block rounded-xl px-3 py-2 transition ${isActive ? 'bg-red-50 text-red-700 font-bold' : 'text-slate-700 hover:bg-slate-50'}`}
                                    >
                                        <div className="text-sm font-bold">{sub.label}</div>
                                        <div className="text-xs text-slate-500 font-medium">{sub.desc}</div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <NavLink to="/contacto" className={navClass}>Contacto</NavLink>
                    <div className="hidden md:block mx-2 h-5 w-px bg-slate-200" />

                    {isAuthenticated ? (
                        <div className="flex flex-col md:flex-row items-center gap-3">
                            <NavLink to="/perfil" className={navClass}>Mi Perfil</NavLink>
                            <span className="text-sm font-medium text-slate-600">Hola, <strong className="text-slate-900">{usuario?.nombre}</strong></span>
                            <button onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">Salir</button>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <NavLink to="/login" className={navClass}>Ingresar</NavLink>
                            <Link to="/registro" className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 shadow-sm">Registrarse</Link>
                        </div>
                    )}

                    <NavLink to="/admin" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white hover:bg-slate-800 transition shadow-sm">Admin</NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;

