// GaleriaProducto.jsx - Imagen grande con miniaturas para cambiar entre las imágenes del producto.

import { useState } from 'react';

// Ajustá el puerto al de tu backend (donde multer sirve /uploads).
const BASE_ARCHIVOS = 'http://localhost:3000';

// El campo imagen es JSON: normalmente un array de rutas, pero los productos
// viejos pueden tener un string (URL). Esto cubre ambos casos.
const aArray = (imagen) => {
    if (!imagen) return [];
    if (Array.isArray(imagen)) return imagen;
    try {
        const parsed = JSON.parse(imagen);
        return Array.isArray(parsed) ? parsed : [imagen];
    } catch {
        return [imagen];
    }
};

// Si la ruta ya es una URL completa se usa tal cual; si no, se le antepone el backend.
const url = (ruta) => (ruta.startsWith('http') ? ruta : `${BASE_ARCHIVOS}${ruta}`);

function GaleriaProducto({ imagen, nombre }) {
    const imagenes = aArray(imagen);
    const [activa, setActiva] = useState(0);

    if (imagenes.length === 0) return null;

    return (
        <div className="space-y-3">
            <img
                src={url(imagenes[activa])}
                alt={nombre}
                className="h-80 w-full rounded-2xl border border-slate-200 bg-white object-contain"
            />

            {imagenes.length > 1 && (
                <div className="flex gap-2">
                    {imagenes.map((ruta, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setActiva(i)}
                            className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                                i === activa ? 'border-indigo-600' : 'border-slate-200 hover:border-slate-400'
                            }`}
                        >
                            <img src={url(ruta)} alt={`${nombre} ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GaleriaProducto;