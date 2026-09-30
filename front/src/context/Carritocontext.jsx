import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CarritoContext = createContext(null);
const STORAGE_KEY = "compumarket_carrito";

// El modelo Producto devuelve `imagen` como array (JSON) o como string.
// Guardamos solo la primera para mostrarla en el carrito.
const primeraImagen = (imagen) => (Array.isArray(imagen) ? imagen[0] : imagen) || null;

const leerGuardado = () => {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [];
  } catch {
    return [];
  }
};

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerGuardado);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* si el storage falla, el carrito sigue funcionando en memoria */
    }
  }, [items]);

  const agregar = (producto, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === producto.id);
      const limite = producto.stock ?? Infinity;

      if (existente) {
        return prev.map((i) =>
          i.id === producto.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, i.stock ?? limite) }
            : i
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          imagen: primeraImagen(producto.imagen),
          stock: producto.stock ?? null,
          cantidad: Math.min(cantidad, limite),
        },
      ];
    });
    setAbierto(true); // abre el carrito flotante al agregar
  };

  const sumar = (id) =>
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && (i.stock == null || i.cantidad < i.stock)
          ? { ...i, cantidad: i.cantidad + 1 }
          : i
      )
    );

  const restar = (id) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.cantidad > 1 ? { ...i, cantidad: i.cantidad - 1 } : i))
    );

  const eliminar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const vaciar = () => setItems([]);

  const cantidadTotal = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);
  const total = useMemo(() => items.reduce((acc, i) => acc + i.precio * i.cantidad, 0), [items]);

  const value = {
    items,
    abierto,
    abrir: () => setAbierto(true),
    cerrar: () => setAbierto(false),
    alternar: () => setAbierto((a) => !a),
    agregar,
    sumar,
    restar,
    eliminar,
    vaciar,
    cantidadTotal,
    total,
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de <CarritoProvider>");
  return ctx;
}