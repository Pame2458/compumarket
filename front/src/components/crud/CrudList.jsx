// CrudList.jsx - Vista de listado general para la consola compuMarket.
// Coordina la barra de herramientas, estados vacíos y la inyección de tablas/grillas.

import List from './entity/List.jsx';
import Toolbar from './ui/Toolbar.jsx';
import EmptyState from './ui/EmptyState.jsx';

const CrudList = ({ resource, items = [], onDetail, onEdit, onDelete, onAdd }) => {
  const totalRegistros = items.length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Toolbar superior con el botón de inserción rojo */}
      <Toolbar resource={resource} onAdd={onAdd} />

      {/* Indicador Senior de auditoría de volumen de datos */}
      {totalRegistros > 0 && (
        <div className="flex justify-between items-center px-2 text-xs font-semibold text-slate-400">
          <p>Mostrando registros disponibles en tiempo real</p>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-mono">
            Total: {totalRegistros} {resource}
          </span>
        </div>
      )}

      {/* Renderizado condicional defensivo */}
      {totalRegistros === 0 ? (
        <EmptyState resource={resource} onAdd={onAdd} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 overflow-hidden">
          <List
            activeTab={resource}
            items={items}
            onDetail={onDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default CrudList;
