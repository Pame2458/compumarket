import { Op, fn, col } from 'sequelize';
import Calificacion from '../models/calificaciones.model.js';
import Cliente from '../models/clientes.model.js';
import Pedido from '../models/pedidos.model.js';
import DetallePedido from '../models/detallePedidos.model.js';
import Producto from '../models/productos.model.js';

export const obtenerPorProducto = async (req, res) => {
    try {
        const idProducto = parseInt(req.params.idProducto, 10);

        // El promedio y el total cuentan TODAS las estrellas, sin importar la moderación del comentario.
        const resumen = await Calificacion.findOne({
            where: { idProducto },
            attributes: [
                [fn('AVG', col('puntaje')), 'promedio'],
                [fn('COUNT', col('id')), 'total'],
            ],
            raw: true,
        });

        // La lista pública solo muestra las reseñas aprobadas, de la más nueva a la más vieja.
        const data = await Calificacion.findAll({
            where: { idProducto, estado: 'aprobada' },
            include: [{ model: Cliente, attributes: ['id', 'nombre', 'apellido'] }],
            order: [['fecha', 'DESC']],
        });

        res.json({
            estado: true,
            promedio: resumen.promedio ? Number(Number(resumen.promedio).toFixed(1)) : 0,
            total: Number(resumen.total) || 0,
            data,
        });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const crear = async (req, res) => {
    try {
        // El cliente sale del token, nunca de lo que manda el navegador.
        const idCliente = req.cliente.id;
        const idProducto = parseInt(req.body.idProducto, 10);
        const puntaje = Number(req.body.puntaje);
        const comentario = req.body.comentario?.trim() || null;

        if (!Number.isInteger(idProducto)) {
            return res.status(400).json({ estado: false, mensaje: 'Producto inválido.' });
        }

        if (!Number.isInteger(puntaje) || puntaje < 1 || puntaje > 5) {
            return res.status(400).json({ estado: false, mensaje: 'El puntaje debe ser un número entero de 1 a 5.' });
        }

        if (comentario && comentario.length > 500) {
            return res.status(400).json({ estado: false, mensaje: 'El comentario no puede superar los 500 caracteres.' });
        }

        // Compra verificada: el cliente tiene que tener un pedido ENTREGADO que incluya este producto.
        const pedidosEntregados = await Pedido.findAll({
            where: { idCliente, estado: 'entregado' },
            attributes: ['id'],
        });
        const idsPedidos = pedidosEntregados.map((p) => p.id);

        const compra = idsPedidos.length
            ? await DetallePedido.findOne({
                  where: { idPedido: { [Op.in]: idsPedidos }, idProducto },
              })
            : null;

        if (!compra) {
            return res.status(403).json({
                estado: false,
                mensaje: 'Solo podés calificar productos de pedidos que ya te fueron entregados.',
            });
        }

        // Una sola reseña por cliente y producto.
        const yaExiste = await Calificacion.findOne({ where: { idCliente, idProducto } });
        if (yaExiste) {
            return res.status(409).json({ estado: false, mensaje: 'Ya calificaste este producto.' });
        }

        // Las estrellas siempre cuentan. Si hay comentario queda pendiente de moderación;
        // si solo dejó estrellas no hay texto que revisar, así que queda aprobada.
        const data = await Calificacion.create({
            idCliente,
            idProducto,
            puntaje,
            comentario,
            estado: comentario ? 'pendiente' : 'aprobada',
        });

        res.status(201).json({
            estado: true,
            mensaje: comentario
                ? '¡Gracias! Tu comentario se publicará cuando sea revisado.'
                : '¡Gracias por tu calificación!',
            data,
        });
    } catch (error) {
        console.error('Error en crear calificación:', error);
        res.status(500).json({ estado: false, mensaje: 'No pudimos guardar tu calificación.' });
    }
};

// NUEVO: GET /api/calificaciones/mis-resenas (cliente logueado)
// Devuelve los productos entregados que faltan calificar y las reseñas que ya dejó.
export const obtenerMisResenas = async (req, res) => {
    try {
        const idCliente = req.cliente.id;

        // 1) Productos que compró y le fueron entregados
        const pedidosEntregados = await Pedido.findAll({
            where: { idCliente, estado: 'entregado' },
            attributes: ['id', 'fecha'],
        });
        const idsPedidos = pedidosEntregados.map((p) => p.id);

        const detalles = idsPedidos.length
            ? await DetallePedido.findAll({ where: { idPedido: { [Op.in]: idsPedidos } } })
            : [];

        // 2) Lo que ya calificó
        const calificaciones = await Calificacion.findAll({
            where: { idCliente },
            order: [['fecha', 'DESC']],
        });

        // 3) Datos de los productos involucrados (de las dos listas)
        const idsProductos = [
            ...new Set([
                ...detalles.map((d) => d.idProducto),
                ...calificaciones.map((c) => c.idProducto),
            ]),
        ];
        const productos = idsProductos.length
            ? await Producto.findAll({ where: { id: { [Op.in]: idsProductos } } })
            : [];
        const productoPorId = new Map(productos.map((p) => [p.id, p]));

        // Productos entregados sin calificar (sin repetir si lo compró en varios pedidos)
        const idsCalificados = new Set(calificaciones.map((c) => c.idProducto));
        const idsVistos = new Set();
        const porCalificar = [];
        for (const d of detalles) {
            if (idsCalificados.has(d.idProducto) || idsVistos.has(d.idProducto)) continue;
            idsVistos.add(d.idProducto);
            const prod = productoPorId.get(d.idProducto);
            porCalificar.push({
                idProducto: d.idProducto,
                idPedido: d.idPedido,
                nombre: prod?.nombre || 'Producto',
                imagen: prod?.imagen || null,
            });
        }

        const calificadas = calificaciones.map((c) => ({
            id: c.id,
            idProducto: c.idProducto,
            nombre: productoPorId.get(c.idProducto)?.nombre || 'Producto',
            puntaje: c.puntaje,
            comentario: c.comentario,
            estado: c.estado,
            motivoRechazo: c.motivoRechazo,
            fecha: c.fecha,
        }));

        res.json({ estado: true, porCalificar, calificadas });
    } catch (error) {
        console.error('Error en obtenerMisResenas:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al obtener tus reseñas.' });
    }
};