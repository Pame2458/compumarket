import { Op } from 'sequelize';
import { Pedido, DetallePedido, Cliente, Producto } from '../models/index.js';
import { emisorDeCorreo } from '../config/configuracionCorreo.js';

const ESTADOS_VALIDOS = ['pendiente', 'en_preparacion', 'enviado', 'entregado', 'cancelado'];

// Texto que se le muestra al cliente según el nuevo estado del pedido.
// "pendiente" no tiene mensaje: no se envía correo cuando vuelve a ese estado.
const MENSAJES_ESTADO = {
    en_preparacion: {
        asunto: 'Tu pedido está en preparación',
        texto: 'Estamos preparando tu pedido. Te avisaremos cuando salga hacia tu domicilio.',
    },
    enviado: {
        asunto: 'Tu pedido fue enviado',
        texto: 'Tu pedido ya salió de nuestro depósito y está en camino.',
    },
    entregado: {
        asunto: 'Tu pedido fue entregado',
        texto: 'Tu pedido fue entregado. ¡Gracias por tu compra!',
    },
    cancelado: {
        asunto: 'Tu pedido fue cancelado',
        texto: 'Tu pedido fue cancelado. Si tenés dudas, respondé a este correo.',
    },
};

// Envía el correo de notificación al cliente. Si falla, solo lo registra en
// consola: un error de correo no debe impedir que el estado se actualice.
const notificarCambioEstado = async (pedido, nuevoEstado) => {
    try {
        const mensaje = MENSAJES_ESTADO[nuevoEstado];
        if (!mensaje) return;

        const cliente = await Cliente.findByPk(pedido.idCliente);
        if (!cliente || !cliente.email) return;

        await emisorDeCorreo.sendMail({
            from: `"compuMarket 🛒" <${process.env.CORREO_EMISOR}>`,
            to: cliente.email,
            subject: `${mensaje.asunto} - Pedido #${pedido.id}`,
            html: `
                <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <h2 style="color: #dc2626; font-weight: 900; margin-bottom: 5px;">compuMarket</h2>
                    <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">${mensaje.asunto}</h3>
                    <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                        Hola, ${cliente.nombre}. ${mensaje.texto}
                    </p>
                    <p style="color: #0f172a; font-size: 14px; font-weight: bold;">
                        Número de pedido: #${pedido.id}
                    </p>
                </div>
            `,
        });
    } catch (error) {
        console.error('Error al enviar correo de cambio de estado:', error);
    }
};

// GET /api/admin/pedidos?pagina=1&limite=5&estado=pendiente&busqueda=juan
// Lista pedidos paginados, con filtro por estado y búsqueda por número de
// pedido o por nombre, apellido o email del cliente.
export const listarPedidos = async (req, res) => {
    try {
        const pagina = Math.max(parseInt(req.query.pagina, 10) || 1, 1);
        const limite = Math.max(parseInt(req.query.limite, 10) || 5, 1);
        const offset = (pagina - 1) * limite;
        const { estado, busqueda } = req.query;

        const where = {};

        // Filtro por estado
        if (estado && ESTADOS_VALIDOS.includes(estado)) {
            where.estado = estado;
        }

        // Búsqueda por número de pedido o por datos del cliente
        if (busqueda && busqueda.trim() !== '') {
            const texto = busqueda.trim();

            const clientes = await Cliente.findAll({
                where: {
                    [Op.or]: [
                        { nombre: { [Op.like]: `%${texto}%` } },
                        { apellido: { [Op.like]: `%${texto}%` } },
                        { email: { [Op.like]: `%${texto}%` } },
                    ],
                },
                attributes: ['id'],
            });
            const idsClientes = clientes.map((c) => c.id);

            const condiciones = [];
            if (idsClientes.length > 0) {
                condiciones.push({ idCliente: { [Op.in]: idsClientes } });
            }
            const numero = parseInt(texto.replace('#', ''), 10);
            if (!Number.isNaN(numero)) {
                condiciones.push({ id: numero });
            }

            // Si no hay ninguna coincidencia posible, no devolvemos nada
            where[Op.or] = condiciones.length > 0 ? condiciones : [{ id: 0 }];
        }

        const { count, rows } = await Pedido.findAndCountAll({
            where,
            include: [
                {
                    model: Cliente,
                    attributes: { exclude: ['password', 'contrasena', 'clave'] },
                },
                {
                    model: DetallePedido,
                    include: [{ model: Producto }],
                },
            ],
            order: [['fecha', 'DESC']],
            limit: limite,
            offset,
            distinct: true,
        });

        return res.json({
            estado: true,
            pedidos: rows,
            total: count,
            pagina,
            limite,
            totalPaginas: Math.max(Math.ceil(count / limite), 1),
        });
    } catch (error) {
        console.error('Error al listar pedidos:', error);
        return res.status(500).json({
            estado: false,
            mensaje: 'Error al listar los pedidos',
            error: error.message,
        });
    }
};

// PUT /api/admin/pedidos/:id/estado
// Cambia el estado de un pedido y avisa por correo al cliente.
// Body: { "estado": "enviado" }
export const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!ESTADOS_VALIDOS.includes(estado)) {
            return res.status(400).json({
                estado: false,
                mensaje: `Estado inválido. Valores permitidos: ${ESTADOS_VALIDOS.join(', ')}`,
            });
        }

        const pedido = await Pedido.findByPk(id);

        if (!pedido) {
            return res.status(404).json({
                estado: false,
                mensaje: 'Pedido no encontrado',
            });
        }

        const estadoAnterior = pedido.estado;

        pedido.estado = estado;
        await pedido.save();

        // Solo se notifica si el estado realmente cambió.
        // No usamos await: la respuesta al admin no espera al correo.
        if (estadoAnterior !== estado) {
            notificarCambioEstado(pedido, estado);
        }

        return res.json({ estado: true, mensaje: 'Estado actualizado', pedido });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        return res.status(500).json({
            estado: false,
            mensaje: 'Error al actualizar el estado',
            error: error.message,
        });
    }
};