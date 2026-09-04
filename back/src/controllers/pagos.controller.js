import Pago from '../models/pagos.model.js';
import Pedido from '../models/pedidos.model.js';
import sequelize from '../config/database.js';

export const registrarIntentoPago = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { idPedido, metodoPago, estadoPago, transaccionPasarelaId, monto } = req.body;

        // Registro permanente de auditoría bancaria externa
        const nuevoPago = await Pago.create({
            idPedido: parseInt(idPedido, 10),
            metodoPago, estadoPago, transaccionPasarelaId, monto
        }, { transaction: t });

        // Si la pasarela notifica éxito ('realizado'), el Pedido cambia su etapa en la base de datos
        if (estadoPago === 'realizado') {
            const pedido = await Pedido.findByPk(idPedido, { transaction: t });
            if (pedido) {
                await pedido.update({ estado: 'procesando' }, { transaction: t });
            }
        }

        await t.commit();
        res.status(201).json({ estado: true, mensaje: 'Notificación procesada correctamente', data: nuevoPago });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ estado: false, mensaje: 'Error al procesar la pasarela', error: error.message });
    }
};
