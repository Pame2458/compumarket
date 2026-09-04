import Envio from '../models/envios.model.js';

export const obtenerPorPedido = async (req, res) => {
    try {
        const data = await Envio.findOne({ where: { idPedido: parseInt(req.params.idPedido, 10) } });
        if (!data) return res.status(404).json({ estado: false, mensaje: 'Envío no localizado' });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const actualizarEstado = async (req, res) => {
    try {
        const envio = await Envio.findOne({ where: { idPedido: parseInt(req.params.idPedido, 10) } });
        if (!envio) return res.status(404).json({ estado: false, mensaje: 'Envío no encontrado' });
        
        // El staff de depósito puede actualizar a estados del enum ('embalado', 'etiquetado', 'enviado', etc.)
        await envio.update(req.body);
        res.json({ estado: true, data: envio });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};
