// MenuCuenta.jsx - Pestañas de navegación de la sección "Mi Cuenta".
import { NavLink } from 'react-router-dom';

const pestanas = [
    { to: '/perfil', etiqueta: 'Mis datos' },
    { to: '/mis-pedidos', etiqueta: 'Mis pedidos' },
];

function MenuCuenta() {
    return (
        <nav className="flex gap-2 border-b border-slate-200">
            {pestanas.map((p) => (
                <NavLink
                    key={p.to}
                    to={p.to}
                    className={({ isActive }) =>
                        `-mb-px border-b-2 px-4 py-2 text-sm font-bold transition ${
                            isActive
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-slate-500 hover:text-slate-800'
                        }`
                    }
                >
                    {p.etiqueta}
                </NavLink>
            ))}
        </nav>
    );
}

export default MenuCuenta;