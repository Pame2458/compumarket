import Carrito from '../models/carritos.model.js';
import CarritoItem from '../models/carritoItems.model.js';
import Producto from '../models/productos.model.js';

export const agregarItem = async (req, res) => {
    try {
        const { idCliente, idProducto, cantidad } = req.body;
        const [carrito] = await Carrito.findOrCreate({ where: { idCliente, estado: 'activo_actual' } });
        const producto = await Producto.findByPk(idProducto);

        if (!producto || producto.stock < cantidad) {
            return res.status(400).json({ estado: false, mensaje: 'Stock insuficiente en el catálogo' });
        }

        const [item, creado] = await CarritoItem.findOrCreate({
            where: { idCarrito: carrito.id, idProducto },
            defaults: { cantidad }
        });

        if (!creado) {
            const totalCarga = item.cantidad + cantidad;
            if (producto.stock < totalCarga) return res.status(400).json({ estado: false, mensaje: 'La cantidad acumulada supera las existencias' });
            await item.update({ cantidad: totalCarga });
        }
        res.json({ estado: true, data: item });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};

export const removerItem = async (req, res) => {
    try {
        const item = await CarritoItem.findByPk(parseInt(req.params.id, 10));
        if (!item) return res.status(404).json({ estado: false, mensaje: 'Item no localizado' });
        await item.destroy();
        res.json({ estado: true, mensaje: 'Producto removido del carrito' });
    } catch (error) {
        res.status(500).json({ estado: false, error: error.message });
    }
};
