import Rol from '../models/roles.model.js';

export const obtener = async (req, res) => {
    try {
        const data = await Rol.findAll();
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, mensaje: 'Error al obtener roles', error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        const data = await Rol.create(req.body);
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, mensaje: 'Error al crear rol', error: error.message });
    }
};
