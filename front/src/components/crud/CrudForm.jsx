// CrudForm.jsx - Vista contenedora para formularios de alta y modificación en compuMarket.
// Envuelve el formulario de la entidad inyectándole una estructura de panel limpia y robusta.

import Form from './entity/Form.jsx';

const CrudForm = ({ resource, item, onSave, onCancel }) => {
  // Determinamos el modo de operación de forma limpia
  const esEdicion = Boolean(item && item.id);
  const nombreRecurso = resource === 'productos' ? 'producto' : 'usuario';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto my-4 animate-fade-in">
      {/* Cabecera contextual del formulario */}
      <div className="border-b border-slate-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight capitalize">
            {esEdicion ? `Modificar ${nombreRecurso}` : `Nuevo ${nombreRecurso}`}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            {esEdicion 
              ? `Editando registro ID #${item.id} en la base de datos.` 
              : `Completá los campos para insertar un nuevo registro en el sistema.`}
          </p>
        </div>
        
        {/* Botón de cancelación rápido unificado en la cabecera */}
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-400 hover:text-slate-600 transition select-none self-start sm:self-auto"
        >
          Cancelar
        </button>
      </div>

      {/* Renderizado del formulario específico de la entidad */}
      <Form
        activeTab={resource}
        item={item}
        onSave={onSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default CrudForm;

