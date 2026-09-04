// ErrorMessage.jsx - Alerta de fallas de carga de datos para compuMarket.
// Proporciona una interfaz visual de alerta de alta fidelidad basada en Tailwind.

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 max-w-2xl mx-auto my-4 text-xs font-semibold text-red-700 animate-fade-in shadow-sm">
      {/* Icono de advertencia */}
      <svg className="h-5 w-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div className="leading-relaxed">
        <span className="font-bold uppercase tracking-wider block mb-0.5 text-[10px] text-red-800">Error del Servidor</span>
        {message}
      </div>
    </div>
  );
};

export default ErrorMessage;

