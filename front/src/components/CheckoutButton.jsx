

import { useState } from 'react';
import { postConfirmarPedido } from '../services/checkoutService.js';

function CheckoutButton({ vaciarCarritoLocal }) {
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    const handleConfirmar = async () => {
        setCargando(true);
        setMensaje('');
        try {
            const data = await postConfirmarPedido();
            setMensaje(`¡Éxito! ID de Orden: #${data.pedidoId || data.id || 'Confirmado'}`);
            
            // Vacía el carrito en el Context API local inmediatamente
            if (vaciarCarritoLocal) {
                vaciarCarritoLocal();
            }
        } catch (error) {
            console.error(error);
            setMensaje(error.response?.data?.mensaje || error.response?.data?.message || 'Error al procesar tu orden.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleConfirmar}
                disabled={cargando}
                className={`w-full py-3 text-sm font-bold text-white rounded-xl transition-colors tracking-wide ${
                    cargando ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
            >
                {cargando ? 'Procesando tu pedido...' : 'Confirmar pedido'}
            </button>
            
            {mensaje && (
                <p className={`mt-2 text-center text-xs font-bold px-2 py-1 rounded-lg ${
                    mensaje.includes('¡Éxito!') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}

export default CheckoutButton;
