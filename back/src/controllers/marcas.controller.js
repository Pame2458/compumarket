import Marca from '../models/marcas.model.js';

export const obtener = async (req, res) => {
    try {
        const data = await Marca.findAll({ where: { estado: 'activo' } });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const data = await Marca.create(req.body);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};
