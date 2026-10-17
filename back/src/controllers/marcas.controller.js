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
        const nombre = req.body.nombre?.trim();

        const existente = await Marca.findOne({ where: { nombre } });
        if (existente) {
            if (existente.estado === 'activo') {
                return res.status(409).json({ estado: false, error: 'Ya existe una marca con ese nombre' });
            }
            await existente.update({ estado: 'activo' });
            return res.json({ estado: true, data: existente });
        }

        const data = await Marca.create({ ...req.body, nombre });
        res.status(201).json({ estado: true, data });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};
export const actualizar = async (req, res) => {
    try {
        const marca = await Marca.findByPk(req.params.id);
        if (!marca) {
            return res.status(404).json({ estado: false, error: 'Marca no encontrada' });
        }
        await marca.update(req.body);
        res.json({ estado: true, data: marca });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};

import Producto from '../models/productos.model.js';

export const eliminar = async (req, res) => {
    try {
        const marca = await Marca.findByPk(req.params.id);
        if (!marca) {
            return res.status(404).json({ estado: false, error: 'Marca no encontrada' });
        }

        const cantidad = await Producto.count({ where: { idMarca: marca.id } });
        if (cantidad > 0) {
            return res.status(409).json({
                estado: false,
                error: `No se puede eliminar: la marca tiene ${cantidad} producto(s) asociado(s)`
            });
        }

        await marca.update({ estado: 'inactivo' });
        res.json({ estado: true, mensaje: 'Marca eliminada' });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};