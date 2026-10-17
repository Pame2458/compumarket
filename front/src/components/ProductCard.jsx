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
      {/* Bloque de Compra: precio a la izquierda, botón a la derecha */}
<div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
  <div className="text-lg font-black text-slate-900">
    ${Number(precio || 0).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
  </div>
  <button
    type="button"
    onClick={() => onAgregarAlCarrito && onAgregarAlCarrito(producto)}
    disabled={!stock || stock <= 0}
    title={stock > 0 ? 'Agregar al carrito' : 'Agotado'}
    aria-label={stock > 0 ? 'Agregar al carrito' : 'Agotado'}
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm transition-colors duration-150 hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
  >
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </button>


      </div>
    </div>
  );
}