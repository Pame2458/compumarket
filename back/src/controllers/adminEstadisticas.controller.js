// adminEstadisticas.controller.js - Estadísticas básicas de ventas para el panel de administración.
import { Op, fn, col } from 'sequelize';
import Pedido from '../models/pedidos.model.js';
import DetallePedido from '../models/detallePedidos.model.js';
import Producto from '../models/productos.model.js';

// Convierte un texto "2026-11-17" en una fecha. Para "hasta" se toma el final del día.
const aFecha = (texto, finDelDia = false) => {
    if (!texto) return null;
    const fecha = new Date(`${texto}T${finDelDia ? '23:59:59.999' : '00:00:00.000'}`);
    return Number.isNaN(fecha.getTime()) ? null : fecha;
};

// GET /api/admin/estadisticas?desde=2026-11-01&hasta=2026-11-30
// Cuenta los pedidos confirmados (todos menos los cancelados) dentro del período.
export const obtenerEstadisticas = async (req, res) => {
    try {
        const desde = aFecha(req.query.desde);
        const hasta = aFecha(req.query.hasta, true);

        if ((req.query.desde && !desde) || (req.query.hasta && !hasta)) {
            return res.status(400).json({ estado: false, mensaje: 'Las fechas no son válidas.' });
        }
        if (desde && hasta && desde > hasta) {
            return res.status(400).json({ estado: false, mensaje: 'La fecha "desde" no puede ser posterior a "hasta".' });
        }

        const where = { estado: { [Op.ne]: 'cancelado' } };
        if (desde && hasta) where.fecha = { [Op.between]: [desde, hasta] };
        else if (desde) where.fecha = { [Op.gte]: desde };
        else if (hasta) where.fecha = { [Op.lte]: hasta };

        // Total vendido y cantidad de pedidos
        const pedidos = await Pedido.findAll({ where, attributes: ['id', 'total'] });
        const totalVentas = pedidos.reduce((acumulado, p) => acumulado + Number(p.total), 0);
        const idsPedidos = pedidos.map((p) => p.id);

        // Productos más vendidos: suma de unidades y de dinero por producto
        let masVendidos = [];
        if (idsPedidos.length > 0) {
            const filas = await DetallePedido.findAll({
                where: { idPedido: { [Op.in]: idsPedidos } },
                attributes: [
                    'idProducto',
                    [fn('SUM', col('cantidad')), 'cantidadVendida'],
                    [fn('SUM', col('subtotal')), 'totalGenerado'],
                ],
                group: ['idProducto'],
                order: [[fn('SUM', col('cantidad')), 'DESC']],
                limit: 10,
                raw: true,
            });

            const productos = await Producto.findAll({
                where: { id: { [Op.in]: filas.map((f) => f.idProducto) } },
            });
            const productoPorId = new Map(productos.map((p) => [p.id, p]));

            masVendidos = filas.map((f) => ({
                idProducto: f.idProducto,
                nombre: productoPorId.get(f.idProducto)?.nombre || `Producto #${f.idProducto}`,
                cantidadVendida: Number(f.cantidadVendida),
                totalGenerado: Number(f.totalGenerado),
            }));
        }

        // La lista se llama "masVendidos" (no "data") para que adminApi no la descarte.
        res.json({
            estado: true,
            totalVentas,
            cantidadPedidos: pedidos.length,
            masVendidos,
        });
    } catch (error) {
        console.error('Error en obtenerEstadisticas:', error);
        res.status(500).json({ estado: false, mensaje: 'Error al calcular las estadísticas.' });
    }
};