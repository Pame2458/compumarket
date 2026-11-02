import sequelize from '../config/database.js';
import Pedido from '../models/pedidos.model.js';
import DetallePedido from '../models/detallePedidos.model.js';
import Producto from '../models/productos.model.js';
import { enviarCorreo } from '../config/configuracionCorreo.js';

const formatearPrecio = (n) =>
    Number(n).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

// Evita que un texto con símbolos HTML rompa el cuerpo del mail.
const esc = (texto) =>
    String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

// Convierte los productos del carrito en un pedido persistente.
// El front manda solo { items: [{ id, cantidad }] }; los precios se toman
// de la base de datos para que el cliente no pueda manipularlos.
export const confirmarPedido = async (req, res) => {
    const idCliente = req.cliente.id;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'El carrito está vacío.' });
    }

    // Transacción: o se guarda todo el pedido o no se guarda nada.
    const t = await sequelize.transaction();

    try {
        let montoTotal = 0;
        const detalles = [];
        const lineasMail = []; // datos para armar los mails

        for (const item of items) {
            const cantidad = Number(item.cantidad);

            if (!Number.isInteger(cantidad) || cantidad < 1) {
                await t.rollback();
                return res.status(400).json({ message: 'Cantidad inválida en el carrito.' });
            }

            const producto = await Producto.findByPk(item.id, { transaction: t });

            if (!producto || producto.estado !== 'activo') {
                await t.rollback();
                return res.status(404).json({ message: 'Un producto del carrito ya no está disponible.' });
            }

            if (producto.stock < cantidad) {
                await t.rollback();
                return res.status(400).json({
                    message: `No hay stock suficiente de ${producto.nombre}.`,
                });
            }

            const subtotal = Number(producto.precio) * cantidad;
            montoTotal += subtotal;

            detalles.push({
                idProducto: producto.id,
                cantidad,
                precioUnitario: producto.precio, // precio histórico
                subtotal,
            });

            lineasMail.push({
                nombre: producto.nombre,
                cantidad,
                precioUnitario: producto.precio,
                subtotal,
            });
        }

        // Pedido con estado inicial 'pendiente' (la fecha se completa sola).
        const nuevoPedido = await Pedido.create(
            { idCliente, estado: 'pendiente', total: montoTotal },
            { transaction: t }
        );

        await DetallePedido.bulkCreate(
            detalles.map((d) => ({ ...d, idPedido: nuevoPedido.id })),
            { transaction: t }
        );

        await t.commit();

        // Tabla de productos que comparten los dos mails.
        const filas = lineasMail
            .map(
                (l) => `
                <tr>
                    <td style="padding:8px;border-bottom:1px solid #eee">${esc(l.nombre)}</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${l.cantidad}</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatearPrecio(l.precioUnitario)}</td>
                    <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatearPrecio(l.subtotal)}</td>
                </tr>`
            )
            .join('');

        const tablaProductos = `
                <table style="width:100%;border-collapse:collapse">
                    <thead>
                        <tr style="background:#f5f5f5">
                            <th style="padding:8px;text-align:left">Producto</th>
                            <th style="padding:8px">Cant.</th>
                            <th style="padding:8px;text-align:right">Precio</th>
                            <th style="padding:8px;text-align:right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${filas}</tbody>
                </table>
                <h3 style="text-align:right">Total: ${formatearPrecio(montoTotal)}</h3>`;

        // --- Notificación 1: comprobante de compra al cliente ---
        // enviarCorreo nunca lanza error: si un mail falla, el pedido igual queda guardado.
        const htmlCliente = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
                <h2>¡Gracias por tu compra, ${esc(req.cliente.nombre)}!</h2>
                <p>Recibimos tu pedido <strong>#${nuevoPedido.id}</strong> y está en estado <strong>pendiente</strong>.</p>
                ${tablaProductos}
                <p style="color:#666;font-size:12px">compuMarket</p>
            </div>`;

        await enviarCorreo(
            req.cliente.email,
            `Comprobante de tu pedido #${nuevoPedido.id}`,
            htmlCliente
        );

        // --- Notificación 2: aviso al administrador de un pedido nuevo ---
        const htmlAdmin = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
                <h2>Nuevo pedido para gestionar</h2>
                <p>Ingresó el pedido <strong>#${nuevoPedido.id}</strong> (estado: pendiente).</p>
                <p><strong>Cliente:</strong> ${esc(req.cliente.nombre)} ${esc(req.cliente.apellido)}<br>
                   <strong>Email:</strong> ${esc(req.cliente.email)}</p>
                ${tablaProductos}
                <p style="color:#666;font-size:12px">Ingresá al panel de administración para gestionarlo.</p>
            </div>`;

        await enviarCorreo(
            process.env.CORREO_ADMIN,
            `Nuevo pedido #${nuevoPedido.id} para gestionar`,
            htmlAdmin
        );

        return res.status(201).json({
            message: 'Pedido confirmado con éxito.',
            pedidoId: nuevoPedido.id,
            total: montoTotal,
        });
    } catch (error) {
        await t.rollback();
        console.error('Error en el flujo de checkout:', error);
        return res.status(500).json({ message: 'Error interno al procesar el pedido.' });
    }
};