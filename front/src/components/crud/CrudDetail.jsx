// CrudDetail.jsx - Vista contenedora de inspección detallada para compuMarket.
// Envuelve el componente Detail inyectándole una estructura de panel limpia y robusta.

import Detail from './entity/Detail.jsx';

const CrudDetail = ({ resource, item, onBack, onEdit, onDelete }) => {
  // Manejo defensivo en caso de que los datos del registro MySQL aún no se hayan cargado
  if (!item) {
    return (
      <div className="text-center py-10 text-xs font-bold uppercase tracking-wider text-slate-400">
        Cargando especificaciones del registro...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto my-4 animate-fade-in">
      {/* Cabecera contextual de la inspección del CRUD */}
      <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight capitalize">
            Ficha del {resource === 'productos' ? 'Producto' : 'Usuario'}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            ID de Registro MySQL: <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">#{item.id}</span>
          </p>
        </div>
        
        {/* Botón de retorno rápido unificado en la cabecera */}
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition select-none self-start sm:self-auto"
        >
          ← Volver al listado
        </button>
      </div>

      {/* Renderizado de la entidad correspondiente */}
      <Detail
        activeTab={resource}
        item={item}
        onBack={onBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default CrudDetail;

