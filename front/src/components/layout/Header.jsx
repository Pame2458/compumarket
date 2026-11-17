import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import log from "../assets/log.png";
import { useCarrito } from '../../context/Carritocontext.jsx';

/* ---------- Estilos gamer reutilizables ---------- */

const navBase =
    'inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-bold no-underline cursor-pointer transition-all duration-300 hover:-translate-y-0.5';

const navIdle =
    'border-transparent bg-transparent text-slate-400 hover:border-red-500/65 hover:bg-red-500/[0.12] hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.35)]';

const navActivo =
    'border-red-500 bg-red-600 text-white shadow-[0_0_16px_rgba(220,38,38,0.55)]';

const iconBtn =
    'relative rounded-lg border border-slate-800 bg-slate-900 text-sm font-bold text-slate-300 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-900/35 hover:text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.45)]';

const btnRegistro =
    'rounded-lg border border-red-500 bg-red-600 px-3 py-2 text-sm font-bold text-white no-underline shadow-[0_0_12px_rgba(220,38,38,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.75)]';

const btnAdmin =
    'rounded-lg border border-amber-500/55 bg-amber-500/[0.12] px-3 py-2 text-sm font-bold text-amber-400 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-400 hover:bg-amber-500/25 hover:text-white hover:shadow-[0_0_18px_rgba(245,158,11,0.5)]';

const dropdownItemBase =
    'block rounded-xl border px-3 py-2 no-underline transition-all duration-[250ms] hover:translate-x-1';

const dropdownItemIdle =
    'border-transparent text-slate-300 hover:border-red-500/55 hover:bg-red-500/[0.12] hover:text-white';

const dropdownItemActivo = 'border-red-500 bg-red-600/20 font-bold text-red-300';

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
    const { cantidadTotal, alternar } = useCarrito();
    const estaEnProductos = location.pathname.startsWith('/productos');

    // Tolera distintos nombres/valores de rol: rol, role, tipo -> 'admin', 'ADMIN', 'administrador'
    const rolUsuario = String(usuario?.rol ?? usuario?.role ?? usuario?.tipo ?? '').toLowerCase();
    const esAdmin = rolUsuario === 'admin' || rolUsuario === 'administrador';

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

    const navClass = ({ isActive }) => `${navBase} ${isActive ? navActivo : navIdle}`;

    return (
        <header className="sticky top-0 z-30 border-b-2 border-red-600 bg-[rgba(1,17,49,0.95)] text-slate-300 shadow-[0_10px_30px_rgba(220,38,38,0.18)] backdrop-blur-[10px]">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <NavLink
                    to="/"
                    className="flex items-center gap-1.5 text-lg font-black tracking-tight text-white no-underline transition-all duration-300 hover:scale-[1.04] hover:[text-shadow:0_0_14px_rgba(239,68,68,0.85)]"
                >
                    <img
                        src={log}
                        alt="Logo CompuMarket"
                        className="h-10 w-10 object-contain"
                    />
                    <span>
                        compu<span className="text-red-500">Market</span>
                    </span>
                </NavLink>

                <button
                    type="button"
                    className={`${iconBtn} px-3 py-2 text-xs md:hidden`}
                    onClick={() => setAbierto(!abierto)}
                >
                    {abierto ? 'Cerrar' : 'Menú'}
                </button>

                <nav
                    className={`${
                        abierto
                            ? 'absolute left-0 top-16 flex w-full flex-col gap-2 border-b-2 border-red-600 bg-slate-950 p-4 md:static md:w-auto md:border-none md:bg-transparent md:p-0'
                            : 'hidden'
                    } items-center gap-1.5 md:flex`}
                >
                    <NavLink to="/" className={navClass} end>Inicio</NavLink>
                    <NavLink to="/empresa" className={navClass}>Nosotros</NavLink>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setProductosAbierto(!productosAbierto)}
                            className={`${navBase} ${estaEnProductos || productosAbierto ? navActivo : navIdle}`}
                        >
                            <span>Productos</span>
                            <svg className={`h-4 w-4 transition-transform duration-200 ${productosAbierto ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {productosAbierto && (
                            <div className="absolute left-0 z-40 mt-2 w-72 rounded-2xl border border-red-500/50 bg-slate-950 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.85),0_0_20px_rgba(220,38,38,0.2)]">
                                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400">Nuestras Categorías</p>
                                {subCategorias.map((sub) => (
                                    <NavLink
                                        key={sub.to} to={sub.to} end={sub.end}
                                        onClick={() => setProductosAbierto(false)}
                                        className={({ isActive }) => `${dropdownItemBase} ${isActive ? dropdownItemActivo : dropdownItemIdle}`}
                                    >
                                        <div className="text-sm font-bold">{sub.label}</div>
                                        <div className="text-xs font-medium text-slate-400">{sub.desc}</div>
                                    </NavLink>
                                ))}
                            </div>
                        )}
                    </div>

                    <NavLink to="/contacto" className={navClass}>Contacto</NavLink>
                    <div className="mx-2 hidden h-5 w-px bg-slate-800 md:block" />

                    <button
                        type="button"
                        onClick={alternar}
                        className={`${iconBtn} p-2`}
                        title="Carrito"
                        aria-label="Abrir carrito"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {cantidadTotal > 0 && (
                            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-[0_0_10px_#ef4444]">
                                {cantidadTotal}
                            </span>
                        )}
                    </button>

                    {isAuthenticated ? (
                        <div className="flex flex-col items-center gap-3 md:flex-row">
                            <NavLink to="/perfil" className={navClass}>Mi Cuenta</NavLink>
                            <span className="text-sm font-medium text-slate-400">
                                Hola, <strong className="text-white">{usuario?.nombre}</strong>
                            </span>
                            <button onClick={logout} className={`${iconBtn} px-3 py-2`}>Salir</button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 md:flex-row">
                            <NavLink to="/login" className={navClass}>Ingresar</NavLink>
                            <Link to="/registro" className={btnRegistro}>Registrarse</Link>
                        </div>
                    )}

                    {isAuthenticated && esAdmin && (
                        <NavLink to="/admin" className={btnAdmin}>Admin</NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;