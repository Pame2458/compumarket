// Tabs.jsx - Control de pestañas del Panel Administrativo de compuMarket.
// Cambia dinámicamente la visualización de la consola utilizando los estilos de la marca.

const TABS = [
  { id: 'productos', label: 'Gestión de Productos' },
  { id: 'usuarios', label: 'Control de Usuarios' },
];

const Tabs = ({ activeTab, onChange }) => {
  return (
    <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 rounded-xl gap-1">
      {TABS.map((tab) => {
        const isSelected = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`flex-1 sm:flex-initial text-center rounded-lg px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none ${
              isSelected
                ? 'bg-red-600 text-white shadow-md transform scale-[1.02]'
                : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
