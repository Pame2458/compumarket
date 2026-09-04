import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Footer() {
    const { user } = useAuth(); // Usamos 'user' para mantener la consistencia con el Header
    const anioActual = new Date().getFullYear();

    return (
        <footer className="mt-auto border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Columna 1: Marca y descripción corporativa */}
                    <div className="space-y-3">
                        <Link to="/" className="text-xl font-black tracking-tight text-slate-900">
                            compu<span className="text-red-600">Market</span>
                        </Link>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Líderes en hardware de alto rendimiento y soluciones tecnológicas para entusiastas y profesionales en toda la Argentina.
                        </p>
                    </div>

                    {/* Columna 2: Categorías de Hardware de tu App.jsx */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Categorías
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600 font-medium">
                            <li>
                                <Link to="/productos" className="transition hover:text-red-600">
                                    Todos los productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/productos/hardware" className="transition hover:text-red-600">
                                    Hardware & Componentes
                                </Link>
                            </li>
                            <li>
                                <Link to="/productos/perifericos" className="transition hover:text-red-600">
                                    Periféricos de Élite
                                </Link>
                            </li>
                            <li>
                                <Link to="/productos/laptops" className="transition hover:text-red-600">
                                    Laptops Gamer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Cuenta y acceso administrativo del DER */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Navegación
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600 font-medium">
                            {user ? (
                                <li>
                                    <Link to="/perfil" className="transition hover:text-red-600">
                                        Mi Panel de Cuenta
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="transition hover:text-red-600">
                                            Iniciar Sesión
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/registro" className="transition hover:text-red-600">
                                            Crear Cuenta
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <Link to="/empresa" className="transition hover:text-red-600">
                                    Sobre Nosotros
                                </Link>
                            </li>
                            {user?.rol === 'admin' && (
                                <li>
                                    <Link to="/admin" className="transition hover:text-red-600 font-bold">
                                        Consola de Administrador
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto Real extraído de los bocetos de tu PDF */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                            Contacto Oficial
                        </h3>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                            <li className="font-semibold text-slate-800">Av. Cabildo 2500, CABA</li>
                            <li>📧 ventas@compumarket.com</li>
                            <li>📞 0800-444-HARDWARE</li>
                            <li className="text-xs text-slate-400 mt-1">Lun a Vie: 9 a 18 hs | Sáb: 9 a 13 hs</li>
                        </ul>
                    </div>
                </div>

                {/* Línea divisoria inferior y copyright de marca */}
                <div className="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 font-medium">
                    <p>© {anioActual} compuMarket - Proyecto Integrador II ISSRC. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

