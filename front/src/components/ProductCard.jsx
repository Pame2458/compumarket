// ProductCard.jsx - Tarjeta visual para listar artículos en el catálogo de compuMarket.
// Implementa botones de acción rojos y diseño adaptivo con utilidades Tailwind.
// La imagen y el nombre llevan al detalle del producto (/producto/:id).

import { Link } from 'react-router-dom';

// Ajustá el puerto al de tu backend (donde multer sirve /uploads).
const BASE_ARCHIVOS = 'http://localhost:3000';

// El campo imagen es JSON: normalmente un array de rutas, pero los productos
// viejos pueden tener un string (URL). Devuelve la primera imagen o null.
const primeraImagen = (imagen) => {
  if (!imagen) return null;
  let lista = imagen;
  if (typeof imagen === 'string') {
    try {
      const parsed = JSON.parse(imagen);
      lista = Array.isArray(parsed) ? parsed : [imagen];
    } catch {
      lista = [imagen];
    }
  }
  const ruta = Array.isArray(lista) ? lista[0] : null;
  if (!ruta) return null;
  return ruta.startsWith('http') ? ruta : `${BASE_ARCHIVOS}${ruta}`;
};

export default function ProductCard({ producto, onAgregarAlCarrito }) {
  const { id, nombre, precio, stock, imagen, Marca, Categoria } = producto || {};

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 animate-fade-in">
      <div>
        {/* Imagen: clic para ir al detalle */}
        <Link to={`/producto/${id}`} className="block">
          <div className="w-full h-40 bg-slate-50 rounded-xl flex items-center justify-center p-2 mb-3">
            <img
              src={primeraImagen(imagen) || "https://placeholder.com"}
              alt={nombre}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
            />
          </div>
        </Link>

        {/* Marca y Stock del DER */}
        <div className="flex justify-between items-center text-[10px] tracking-wider mb-1">
          <span className="font-bold uppercase text-red-600">
            {Marca?.nombre || 'Genérica'}
          </span>
          <span className={`font-bold uppercase ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stock > 0 ? `Stock: ${stock}` : 'Sin Stock'}
          </span>
        </div>

        {/* Nombre del Producto: clic para ir al detalle */}
        <Link to={`/producto/${id}`} className="block hover:text-red-600 transition-colors">
          <h3 className="text-slate-800 font-black text-sm leading-snug line-clamp-2 h-10 mb-1" title={nombre}>
            {nombre}
          </h3>
        </Link>

        {/* Mapeo de Categorías (Tabla productoCategoria) */}
        <div className="flex flex-wrap gap-1 mb-3 h-5 overflow-hidden">
          {Categoria?.map((cat, index) => (
            <span key={index} className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
              {cat.nombre}
            </span>
          ))}
        </div>
      </div>

      {/* Bloque de Compra con el Botón Rojo Corporativo */}
      <div className="mt-2 pt-2 border-t border-slate-100">
        <div className="text-lg font-black text-slate-900 mb-3">
          ${Number(precio || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </div>
        <button
          type="button"
          onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}
          disabled={!stock || stock <= 0}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-xl transition-colors duration-150 shadow-sm text-xs uppercase tracking-wider"
        >
          {stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
        </button>
      </div>
    </div>
  );
}