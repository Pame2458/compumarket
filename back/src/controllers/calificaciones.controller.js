import Calificacion from '../models/calificaciones.model.js';
import Cliente from '../models/clientes.model.js';

export const obtenerPorProducto = async (req, res) => {
    try {
        const data = await Calificacion.findAll({
            where: { idProducto: parseInt(req.params.idProducto, 10) },
            include: [{ model: Cliente, attributes: ['id', 'nombre', 'apellido'] }]
        });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const data = await Calificacion.create(req.body);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};

