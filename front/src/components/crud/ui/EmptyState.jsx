
// EmptyState.jsx - Vista de inventario o lista vacía para la consola compuMarket.
// Implementa botones de acción rojos y un diseño limpio con Tailwind CSS.

const label = (resource) => (resource === 'productos' ? 'producto' : 'usuario');

const EmptyState = ({ resource, onAdd }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white border border-dashed border-slate-300 rounded-2xl max-w-xl mx-auto my-6 shadow-sm">
      {/* Ícono descriptivo de caja/búsqueda vacía */}
      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m16.5 0a2.25 2.25 0 0 0-2.25-2.25H18A2.25 2.25 0 0 0 15.75 3H8.25A2.25 2.25 0 0 0 6 5.25h-.75A2.25 2.25 0 0 0 3 7.5m16.5 0V6a2.25 2.25 0 0 0-2.25-2.25H18A2.25 2.25 0 0 0 15.75 3H8.25A2.25 2.25 0 0 0 6 5.25h-.75A2.25 2.25 0 0 0 3 6v1.5m11.25 3.5h-4.5" />
        </svg>
      </div>

      <p className="text-sm font-semibold text-slate-500 mb-4 leading-relaxed">
        No hay registros de <span className="text-slate-800 font-bold">{resource}</span> para mostrar en el sistema.
      </p>

      {/* Botón de inserción rojo */}
      <button 
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-red-700 active:bg-red-800 transition duration-200 select-none"
      >
        <span className="text-sm font-black">+</span> Agregar {label(resource)}
      </button>
    </div>
  );
};

export default EmptyState;
