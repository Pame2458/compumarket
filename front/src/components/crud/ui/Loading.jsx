// Loading.jsx - Pantalla de espera interactiva para compuMarket.
// Proporciona un spinner y animación de carga estilizada con Tailwind CSS.

const Loading = ({ resource = "datos" }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center max-w-sm mx-auto my-8 animate-pulse select-none">
      {/* Spinner giratorio estilizado con el rojo de compuMarket */}
      <div className="relative flex items-center justify-center mb-4">
        {/* Círculo externo animado */}
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-red-600 animate-spin"></div>
        {/* Punto central estático con estética tech */}
        <div className="absolute w-2 h-2 bg-slate-900 rounded-full"></div>
      </div>

      {/* Mensaje dinámico de carga */}
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
        Sincronizando {resource}
      </p>
      <span className="text-[11px] text-slate-400 mt-1 font-medium">
        Por favor, aguardá unos instantes...
      </span>
    </div>
  );
};

export default Loading;

