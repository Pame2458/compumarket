// src/seeders/pedidos.seeder.js
import Cliente from '../models/clientes.model.js';
import Producto from '../models/productos.model.js';
import Pedido from '../models/pedidos.model.js';
import DetallePedido from '../models/detallePedidos.model.js';

// Pedido de prueba para probar el correo de cambio de estado
// sin depender del checkout.
export const seedPedidoPrueba = async () => {
    try {
        console.log('🌱 Iniciando Seeding de pedido de prueba...');

        const cliente = await Cliente.findOne({ where: { email: 'pamesacaba1612@gmail.com' } });
        if (!cliente) {
            console.log('⚠️ No se encontró el cliente pamesacaba1612@gmail.com. Registralo primero.');
            return;
        }

        const producto = await Producto.findOne({ where: { sku: 'LOGI-GPROX-001' } });
        if (!producto) {
            console.log('⚠️ No se encontró el producto de prueba. Corré antes el seeder de productos.');
            return;
        }

        // findOrCreate: si el servidor se reinicia, no duplica el pedido
        const [pedido, creado] = await Pedido.findOrCreate({
            where: { idCliente: cliente.id, total: 129.50 },
            defaults: { estado: 'pendiente' },
        });

        if (creado) {
            await DetallePedido.create({
                idPedido: pedido.id,
                idProducto: producto.id,
                cantidad: 1,
                precioUnitario: producto.precio,
                subtotal: producto.precio,
            });
        }

        console.log('✅ Pedido de prueba listo.');
    } catch (error) {
        console.error('❌ Error en el seeder de pedido de prueba:', error);
    }
};