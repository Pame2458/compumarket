import { Op } from 'sequelize';
import Calificacion from '../models/calificaciones.model.js';
import Cliente from '../models/clientes.model.js';
import Producto from '../models/productos.model.js';

// Motivos válidos para rechazar un comentario.
const MOTIVOS_RECHAZO = ['ofensivo', 'spam', 'no_relacionado'];

// GET /api/admin/calificaciones?estado=pendiente
// Lista las reseñas con comentario según su estado (por defecto, las pendientes).
export const listarCalificaciones = async (req, res) => {
    try {
        const estado = req.query.estado || 'pendiente';

        if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ estado: false, mensaje: 'Estado inválido.' });
        }

        const calificaciones = await Calificacion.findAll({
            // Solo reseñas con comentario: las de solo estrellas no tienen texto que moderar.
            where: { estado, comentario: { [Op.ne]: null } },
            include: [{ model: Cliente, attributes: ['id', 'nombre', 'apellido'] }],
            order: [['fecha', 'ASC']],
        });

        // Nombre del producto de cada reseña
        const idsProductos = [...new Set(calificaciones.map((c) => c.idProducto))];
        const productos = idsProductos.length
            ? await Producto.findAll({ where: { id: { [Op.in]: idsProductos } } })
            : [];
        const productoPorId = new Map(productos.map((p) => [p.id, p]));

        const data = calificaciones.map((c) => ({
            ...c.toJSON(),
            nombreProducto: productoPorId.get(c.idProducto)?.nombre || `Producto #${c.idProducto}`,
        }));

        res.json({ estado: true, data });
    } catch (error) {
        console.error('Error en listarCalificaciones:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al listar las reseñas.' });
    }
};

// PUT /api/admin/calificaciones/:id/moderar
// Body: { estado: 'aprobada' | 'rechazada', motivoRechazo? }
export const moderarCalificacion = async (req, res) => {
    try {
        const { estado, motivoRechazo } = req.body;

        if (!['aprobada', 'rechazada'].includes(estado)) {
            return res.status(400).json({ estado: false, mensaje: 'El estado debe ser aprobada o rechazada.' });
        }

        // Para rechazar, el motivo es obligatorio y tiene que ser uno de la lista.
        if (estado === 'rechazada' && !MOTIVOS_RECHAZO.includes(motivoRechazo)) {
            return res.status(400).json({
                estado: false,
                mensaje: 'Para rechazar elegí un motivo: ofensivo, spam o no_relacionado.',
            });
        }

        const calificacion = await Calificacion.findByPk(req.params.id);
        if (!calificacion) {
            return res.status(404).json({ estado: false, mensaje: 'La reseña no existe.' });
        }

        // Solo se moderan reseñas que tengan comentario (las de solo estrellas no tienen texto que revisar).
        if (!calificacion.comentario) {
            return res.status(400).json({ estado: false, mensaje: 'Esta reseña no tiene comentario para moderar.' });
        }

        calificacion.estado = estado;
        calificacion.motivoRechazo = estado === 'rechazada' ? motivoRechazo : null;
        await calificacion.save();

        res.json({
            estado: true,
            mensaje: estado === 'aprobada' ? 'Reseña aprobada.' : 'Reseña rechazada.',
            data: calificacion,
        });
    } catch (error) {
        console.error('Error en moderarCalificacion:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al moderar la reseña.' });
    }
};