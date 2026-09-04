import Usuario from '../models/usuarios.model.js';
import Rol from '../models/roles.model.js';

export const obtener = async (req, res) => {
    try {
        const data = await Usuario.findAll({
            attributes: { exclude: ['password'] },
            include: [{ model: Rol, as: 'rol' }]
        });
        res.json({ estado: true, data });
    } catch (error) {
        res.status(500).json({ estado: false, mensaje: 'Error al obtener usuarios', error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        // El hook 'beforeCreate' del modelo hashea la clave automáticamente
        const data = await Usuario.create(req.body);
        const respuesta = data.toJSON();
        delete respuesta.contraseña;
        res.status(201).json({ estado: true, data: respuesta });
    } catch (error) {
        res.status(400).json({ estado: false, mensaje: 'Error al crear usuario', error: error.message });
    }
};

export const actualizar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(parseInt(req.params.id, 10));
        if (!usuario) return res.status(404).json({ estado: false, mensaje: 'Usuario no encontrado' });
        
        // El hook 'beforeUpdate' del modelo re-hashea la contraseña si fue modificada en el body
        await usuario.update(req.body);
        const respuesta = usuario.toJSON();
        delete respuesta.contraseña;
        res.json({ estado: true, data: respuesta });
    } catch (error) {
        res.status(400).json({ estado: false, error: error.message });
    }
};
export const eliminar = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(parseInt(req.params.id, 10));
        if (!usuario) return res.status(404).json({ estado: false, mensaje: 'Usuario no encontrado' });

        await usuario.destroy();
        res.json({ estado: true, mensaje: 'Usuario eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ estado: false, mensaje: 'Error al eliminar usuario', error: error.message });
    }
};