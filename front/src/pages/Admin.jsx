// Admin.jsx - Consola central de Administración para compuMarket.
// Orquesta las pestañas y los paneles de control de inventario y clientes.

import { useState } from 'react';
import Tabs from '../components/crud/layout/Tabs.jsx';
import CrudPanel from '../components/crud/CrudPanel.jsx';
import SimplePanel from '../components/simple/SimplePanel.jsx';

const DEFAULT_MODE = import.meta.env.VITE_APP_MODE || 'simple';

function Admin() {
    const [activeTab, setActiveTab] = useState('productos');
    const [mode, setMode] = useState(DEFAULT_MODE);

    const isCrud = mode === 'crud';

    // Clases base reutilizables para los botones del switch de modo de consola
    const toggleButtonClass = (isActive) =>
        `px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 select-none ${
            isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
        }`;

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
            {/* Barra de Encabezado Superior del Panel */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block"></span>
                        Consola de Gestión
                    </h1>
                    <p className="text-xs font-medium text-slate-400">
                        Administración central del catálogo de hardware y perfiles de usuarios.
                    </p>
                </div>

                {/* Selector de Modo Técnico (Switch Minimalista) */}
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 pl-2 pr-1">
                        Interfaz:
                    </span>
                    <button
                        type="button"
                        className={toggleButtonClass(!isCrud)}
                        onClick={() => setMode('simple')}
                    >
                        Vista Simple
                    </button>
                    <button
                        type="button"
                        className={toggleButtonClass(isCrud)}
                        onClick={() => setMode('crud')}
                    >
                        Modo Avanzado
                    </button>
                </div>
            </div>

            {/* Inyección del Selector de Pestañas (Productos o Usuarios) */}
            <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
                <Tabs activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Inyección Dinámica del Panel Orquestador */}
            <main className="pt-2">
                {isCrud ? (
                    <CrudPanel key={activeTab} resource={activeTab} />
                ) : (
                    <SimplePanel key={activeTab} resource={activeTab} />
                )}
            </main>
        </div>
    );
}

export default Admin;

