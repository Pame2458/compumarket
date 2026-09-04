// Toolbar.jsx - Barra de herramientas superior para la consola de administración compuMarket.
// Proporciona un encabezado dinámico y el botón de inserción rojo unificado.

const label = (resource) => (resource === 'productos' ? 'producto' : 'usuario');

const Toolbar = ({ resource, onAdd }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm mb-6">
      {/* Título contextual del módulo del inventario/usuarios */}
      <div>
        <h2 className="text-base font-black text-slate-900 tracking-tight capitalize">
          Panel de {resource}
        </h2>
        <p className="text-xs text-slate-400 font-medium">
          Mantenimiento de registros y sincronización con la base de datos MySQL.
        </p>
      </div>

      {/* Botón de acción comercial rojo unificado */}
      <button 
        type="button"
        onClick={onAdd}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-red-700 active:bg-red-800 transition duration-200 select-none w-full sm:w-auto"
      >
        <span className="text-sm font-black leading-none">+</span> Agregar {label(resource)}
      </button>
    </div>
  );
};

export default Toolbar;
