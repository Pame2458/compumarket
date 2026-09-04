// CrudPanel.jsx - Orquestador lógico (Cerebro) del módulo CRUD de compuMarket.
// Sincroniza estados de carga, errores de red con Axios y vistas basadas en tu DER.

import { useEffect, useState, useCallback } from 'react';
import {
  obtenerItems,
  obtenerDetalle,
  crearItem,
  actualizarItem,
  eliminarItem,
} from '../../services/api.js';
import Loading from './ui/Loading.jsx';
import ErrorMessage from './ui/ErrorMessage.jsx';
import CrudList from './CrudList.jsx';
import CrudDetail from './CrudDetail.jsx';
import CrudForm from './CrudForm.jsx';

const CrudPanel = ({ resource }) => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sincronización limpia de estados en la fase de renderizado síncrono al cambiar de pestaña
  const [prevResource, setPrevResource] = useState(resource);
  if (resource !== prevResource) {
    setPrevResource(resource);
    setLoading(true);
    setError(null);
    setSelected(null);
    setEditing(undefined);
    setItems([]);
  }

  // Recarga la lista desde el backend (Envuelto en useCallback para optimizar renders)
  const reloadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerItems(resource);
      setItems(data || []);
    } catch (err) {
      setError(err.message || 'Error al sincronizar con el servidor MySQL.');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  // Sincronización inicial con la API externa (Petición HTTP) libre de cascadas
  useEffect(() => {
    let active = true;

    obtenerItems(resource)
      .then((data) => {
        if (active) setItems(data || []);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Error de conexión con Express.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [resource]);

  // Obtiene la fila por ID (Inspección detallada)
  const showDetail = async (id) => {
    setLoading(true);
    setError(null);
    setEditing(undefined);
    try {
      const data = await obtenerDetalle(resource, id);
      setSelected(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Abre el formulario (null = creación, objeto = edición)
  const showForm = (item = null) => {
    setError(null);
    setSelected(null);
    setEditing(item);
  };

  // Envía datos de alta o modificación
  const saveItem = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      if (editing && editing.id) {
        await actualizarItem(resource, editing.id, payload);
      } else {
        await crearItem(resource, payload);
      }
      setEditing(undefined);
      await reloadItems();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al persistir el registro.');
      setLoading(false);
    }
  };

  // Elimina un registro aplicando borrado lógico
  const deleteItem = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro de la base de datos?')) return;

    setLoading(true);
    setError(null);
    try {
      await eliminarItem(resource, id);
      setSelected(null); 
      setEditing(undefined);
      await reloadItems();
    } catch (err) {
      setError(err.message || 'Error al ejecutar la sentencia.');
      setLoading(false);
    }
  };

  // Renders Condicionales de la Interfaz
  if (loading) return <Loading resource={resource} />;
  if (error) return <ErrorMessage message={error} />;

  if (editing !== undefined) {
    return (
      <CrudForm
        resource={resource}
        item={editing}
        onSave={saveItem}
        onCancel={() => setEditing(undefined)}
      />
    );
  }

  if (selected) {
    return (
      <CrudDetail
        resource={resource}
        item={selected}
        onBack={() => setSelected(null)}
        onEdit={() => showForm(selected)}
        onDelete={() => deleteItem(selected.id)}
      />
    );
  }

  return (
    <CrudList
      resource={resource}
      items={items}
      onDetail={showDetail}
      onEdit={showForm}
      onDelete={deleteItem}
      onAdd={showForm}
    />
  );
};

export default CrudPanel;


