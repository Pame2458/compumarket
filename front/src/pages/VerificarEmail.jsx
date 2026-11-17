import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function VerificarEmail() {
    const [searchParams] = useSearchParams();
    const [estado, setEstado] = useState('cargando'); // cargando | ok | error
    const [mensaje, setMensaje] = useState('Verificando tu correo...');
    const yaEnviado = useRef(false);

    useEffect(() => {
        // Evita que el efecto corra dos veces en modo desarrollo
        if (yaEnviado.current) return;
        yaEnviado.current = true;

        const token = searchParams.get('token');
        if (!token) {
            setEstado('error');
            setMensaje('El enlace no es válido.');
            return;
        }

        fetch(`${API_URL}/auth/cliente/verificar-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
        })
            .then(async (res) => {
                const data = await res.json();
                setEstado(data.estado ? 'ok' : 'error');
                setMensaje(data.mensaje);
            })
            .catch(() => {
                setEstado('error');
                setMensaje('No se pudo conectar con el servidor.');
            });
    }, [searchParams]);

    return (
        <div style={{ maxWidth: 420, margin: '80px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#dc2626' }}>compuMarket</h2>
            <p style={{ color: estado === 'error' ? '#dc2626' : '#0f172a' }}>{mensaje}</p>
            {estado !== 'cargando' && (
                <Link to="/login" style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    Ir a iniciar sesión
                </Link>
            )}
        </div>
    );
}