import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const WHATSAPP_NUMERO = '549XXXXXXXXXX';
const WHATSAPP_TEXTO = 'Hola compuMarket, quisiera hacer una consulta.';
const INSTAGRAM_USUARIO = 'compu_market';
const EMAIL_CONTACTO = 'ventas@compumarket.com';

/* ---------- Clases Tailwind reutilizables (reemplazan a Footer.css) ---------- */

const tituloColumna =
    'mb-3.5 inline-block border-b-2 border-red-600 pb-1 text-xs font-bold uppercase tracking-widest text-white';

const linkBase =
    'group -ml-3 flex items-center justify-between rounded-lg border border-transparent px-3 py-1.5 no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/65 hover:bg-red-500/[0.12] hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.35)]';

const linkNormal = `${linkBase} text-slate-400`;
const linkAdmin = `${linkBase} font-bold text-amber-400`;

const flecha =
    '-translate-x-1.5 text-red-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100';

const contactoBase =
    'flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-300 no-underline transition-all duration-300 hover:scale-[1.03]';

const btnEmail = `${contactoBase} hover:border-red-500 hover:bg-red-900/35 hover:text-white hover:shadow-[0_0_18px_rgba(239,68,68,0.45)]`;
const btnWhatsapp = `${contactoBase} hover:border-emerald-500 hover:bg-emerald-900/35 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]`;
const btnInstagram = `${contactoBase} hover:border-fuchsia-500 hover:bg-fuchsia-900/35 hover:text-fuchsia-300 hover:shadow-[0_0_18px_rgba(217,70,239,0.45)]`;

/* ---------- Datos ---------- */

const categorias = [
    { to: '/productos', label: 'Todos los productos' },
    { to: '/productos/hardware', label: 'Hardware & Componentes' },
    { to: '/productos/perifericos', label: 'Periféricos de Élite' },
    { to: '/productos/laptops', label: 'Laptops Gamer' },
];

function FooterLink({ to, children, admin = false, icono = '→' }) {
    return (
        <li>
            <Link to={to} className={admin ? linkAdmin : linkNormal}>
                <span>{children}</span>
                <span className={flecha}>{icono}</span>
            </Link>
        </li>
    );
}

function Footer() {
    const { usuario, isAuthenticated } = useAuth();
    const anioActual = new Date().getFullYear();

    return (
        <footer className="relative mt-auto border-t-2 border-red-600 bg-slate-950 text-slate-300 shadow-[0_-10px_30px_rgba(220,38,38,0.18)]">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Columna 1: Marca y descripción corporativa */}
                    <div className="space-y-3">
                        <Link
                            to="/"
                            className="inline-block text-2xl font-black text-white no-underline transition-all duration-300 hover:scale-105 hover:[text-shadow:0_0_14px_rgba(239,68,68,0.85)]"
                        >
                            compu<span className="text-red-500">Market</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Líderes en hardware de alto rendimiento y soluciones tecnológicas para entusiastas y profesionales en toda la Argentina.
                        </p>
                    </div>

                    {/* Columna 2: Categorías */}
                    <div>
                        <h3 className={tituloColumna}>Categorías</h3>
                        <ul className="space-y-1.5 text-sm font-medium">
                            {categorias.map((cat) => (
                                <FooterLink key={cat.to} to={cat.to}>{cat.label}</FooterLink>
                            ))}
                        </ul>
                    </div>

                    {/* Columna 3: Navegación */}
                    <div>
                        <h3 className={tituloColumna}>Navegación</h3>
                        <ul className="space-y-1.5 text-sm font-medium">
                            {isAuthenticated ? (
                                <FooterLink to="/perfil">Mi Cuenta</FooterLink>
                            ) : (
                                <>
                                    <FooterLink to="/login">Iniciar Sesión</FooterLink>
                                    <FooterLink to="/registro">Crear Cuenta</FooterLink>
                                </>
                            )}
                            <FooterLink to="/empresa">Sobre Nosotros</FooterLink>
                            {isAuthenticated && usuario?.rol === 'admin' && (
                                <FooterLink to="/admin" admin icono="⚡">
                                    Consola de Administrador
                                </FooterLink>
                            )}
                        </ul>
                    </div>

                    {/* Columna 4: Contacto Oficial */}
                    <div>
                        <h3 className={tituloColumna}>Contacto Oficial</h3>
                        <ul className="space-y-2.5 text-sm">
                            <li className="font-semibold text-slate-200">📍 Av. Cabildo 2500, CABA</li>
                            <li>
                                <a href={`mailto:${EMAIL_CONTACTO}`} className={btnEmail}>
                                    <span>📧</span>
                                    <span className="truncate">{EMAIL_CONTACTO}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(WHATSAPP_TEXTO)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={btnWhatsapp}
                                >
                                    <span>📞</span>
                                    <span>WhatsApp: +{WHATSAPP_NUMERO}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`https://instagram.com/${INSTAGRAM_USUARIO}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={btnInstagram}
                                >
                                    <span>📸</span>
                                    <span>@{INSTAGRAM_USUARIO}</span>
                                </a>
                            </li>
                            <li className="pt-1 text-xs text-slate-500">
                                Lun a Vie: 9 a 18 hs | Sáb: 9 a 13 hs
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Línea divisoria inferior y copyright */}
                <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs font-medium text-slate-500">
                    <p>© {anioActual} compuMarket - Proyecto Integrador II ISSRC. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;