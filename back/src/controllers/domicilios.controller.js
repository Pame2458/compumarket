import Domicilio from '../models/domicilios.model.js';

export const obtenerPorCliente = async (req, res) => {
    try {
        const data = await Domicilio.findAll({ where: { idCliente: parseInt(req.params.idCliente, 10) } });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const data = await Domicilio.create(req.body);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};
