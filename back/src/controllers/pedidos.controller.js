import sequelize from '../config/database.js';
import Carrito from '../models/carritos.model.js';
import CarritoItem from '../models/carritoItems.model.js';
import Pedido from '../models/pedidos.model.js';
import DetallePedido from '../models/detallePedidos.model.js';
import Envio from '../models/envios.model.js';
import Producto from '../models/productos.model.js';

export const procesarCheckout = async (req, res) => {
    const t = await sequelize.transaction(); // Garantía de consistencia ACID en picos masivos de tráfico
    try {
        const { idCliente, idCarrito, total, direccionEntrega } = req.body;
        const carrito = await Carrito.findOne({
            where: { id: idCarrito, idCliente, estado: 'activo_actual' },
            include: [{ model: CarritoItem }]
        });

        if (!carrito || carrito.CarritoItems.length === 0) {
            return res.status(400).json({ estado: false, mensaje: 'Flujo de checkout inválido o carrito vacío' });
        }

        const nuevoPedido = await Pedido.create({ idCliente, total }, { transaction: t });

        for (const item of carrito.CarritoItems) {
            const producto = await Producto.findByPk(item.idProducto, { transaction: t });
            if (!producto || producto.stock < item.cantidad) throw new Error(`Quiebre de stock para el ID: ${item.idProducto}`);

            // Descuento automático de existencias físicas
            await producto.update({ stock: producto.stock - item.cantidad }, { transaction: t });
            
            // Inmutabilidad financiera: clonamos los precios actuales del catálogo
            await DetallePedido.create({
                idPedido: nuevoPedido.id,
                idProducto: item.idProducto,
                cantidad: item.cantidad,
                precioUnitario: producto.precio,
                subtotal: producto.precio * item.cantidad
            }, { transaction: t });
        }

        // Inyección del Snapshot inmutable JSON en el envío (Relación 1:1 estricta con Pedido)
        await Envio.create({ idPedido: nuevoPedido.id, direccionEntregaHistorica: direccionEntrega }, { transaction: t });
        
        // El carro pasa a histórico y libera la sesión del comprador
        await carrito.update({ estado: 'comprado' }, { transaction: t });
        
        await t.commit();
        res.status(201).json({ estado: true, mensaje: 'Compra procesada exitosamente', data: { idPedido: nuevoPedido.id } });
    } catch (error) {
        await t.rollback(); // Deshace cualquier cambio físico si un producto se quedó sin inventario en milisegundos
        res.status(400).json({ estado: false, mensaje: 'Error al procesar el checkout transaccional', error: error.message });
    }
};
