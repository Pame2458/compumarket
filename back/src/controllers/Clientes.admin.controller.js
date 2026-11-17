// clientes.admin.controller.js - Consulta de clientes desde el panel de administración
import { Op } from 'sequelize';
import Cliente from '../models/clientes.model.js';
import Pedido from '../models/pedidos.model.js';

// Columnas permitidas para ordenar
const COLUMNAS_ORDEN = ['id', 'nombre', 'apellido', 'email'];

// Campos que se retornan al frontend
const CAMPOS_PUBLICOS = ['id', 'nombre', 'apellido', 'email', 'emailVerificado'];

// GET /admin/clientes?pagina&limite&ordenarPor&direccion&busqueda
export const listarClientes = async (req, res) => {
    try {
        const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
        const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 10, 1), 50);
        const ordenarPor = COLUMNAS_ORDEN.includes(req.query.ordenarPor) ? req.query.ordenarPor : 'id';
        const direccion = req.query.direccion === 'DESC' ? 'DESC' : 'ASC';

        const where = {};

        if (req.query.busqueda) {
            const texto = `%${String(req.query.busqueda).trim()}%`;

            // CAMBIO: Op.like en vez de Op.iLike (iLike solo existe en PostgreSQL, y tu base es MySQL).
            where[Op.or] = [
                { nombre: { [Op.like]: texto } },
                { apellido: { [Op.like]: texto } },
                { email: { [Op.like]: texto } },
            ];
        }

        const { count, rows } = await Cliente.findAndCountAll({
            where,
            attributes: CAMPOS_PUBLICOS,
            order: [[ordenarPor, direccion]],
            limit: limite,
            offset: (pagina - 1) * limite,
            distinct: true,
        });

        return res.json({
            clientes: rows,
            total: count,
            pagina,
            limite,
            totalPaginas: Math.max(1, Math.ceil(count / limite)),
        });
    } catch (error) {
        console.error('Error al listar clientes:', error);
        return res.status(500).json({
            message: 'Error interno al listar los clientes.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// GET /admin/clientes/:id/pedidos
export const listarPedidosDeCliente = async (req, res) => {
    try {
        const clienteId = parseInt(req.params.id, 10);
        if (isNaN(clienteId)) {
            return res.status(400).json({ message: 'El ID del cliente no es válido.' });
        }

        const pedidos = await Pedido.findAll({
            where: { idCliente: clienteId },
            order: [['id', 'DESC']],
        });

        return res.json({ pedidos });
    } catch (error) {
        console.error('Error al listar los pedidos del cliente:', error);
        return res.status(500).json({ message: 'Error interno al listar los pedidos.' });
    }
};