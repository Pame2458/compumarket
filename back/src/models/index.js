import Rol from './roles.model.js';
import Usuario from './usuarios.model.js';
import Cliente from './clientes.model.js';
import Domicilio from './domicilios.model.js';
import Marca from './marcas.model.js';
import Categoria from './categorias.model.js';
import Producto from './productos.model.js';
import ProductoCategoria from './productoCategoria.model.js';
import Calificacion from './calificaciones.model.js';
import Carrito from './carritos.model.js';
import CarritoItem from './carritoItems.model.js';
import Pedido from './pedidos.model.js';
import DetallePedido from './detallePedidos.model.js';
import Pago from './pagos.model.js';
import Envio from './envios.model.js';

// --- RELACIONES MÓDULO ACCESOS ---
Rol.hasMany(Usuario, { foreignKey: 'rolId', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Usuario.belongsTo(Rol, { foreignKey: 'rolId', as: 'rol' });

Cliente.hasMany(Domicilio, { foreignKey: 'idCliente', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Domicilio.belongsTo(Cliente, { foreignKey: 'idCliente' });

// --- RELACIONES MÓDULO CATÁLOGO ---
Marca.hasMany(Producto, { foreignKey: 'idMarca', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Producto.belongsTo(Marca, { foreignKey: 'idMarca' });

Categoria.hasMany(Producto, { foreignKey: 'idCategoria', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Producto.belongsTo(Categoria, { foreignKey: 'idCategoria' });

Cliente.hasMany(Calificacion, { foreignKey: 'idCliente', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Calificacion.belongsTo(Cliente, { foreignKey: 'idCliente' });

Producto.hasMany(Calificacion, { foreignKey: 'idProducto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Calificacion.belongsTo(Producto, { foreignKey: 'idProducto' });

// --- RELACIONES MÓDULO CARRITOS MULTIPLES ---
Cliente.hasMany(Carrito, { foreignKey: 'idCliente', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Carrito.belongsTo(Cliente, { foreignKey: 'idCliente' });

Carrito.hasMany(CarritoItem, { foreignKey: 'idCarrito', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CarritoItem.belongsTo(Carrito, { foreignKey: 'idCarrito' });

Producto.hasMany(CarritoItem, { foreignKey: 'idProducto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
CarritoItem.belongsTo(Producto, { foreignKey: 'idProducto' });

// --- RELACIONES MÓDULO VENTAS Y LOGÍSTICA ---
Cliente.hasMany(Pedido, { foreignKey: 'idCliente', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Pedido.belongsTo(Cliente, { foreignKey: 'idCliente' });

Pedido.hasMany(DetallePedido, { foreignKey: 'idPedido', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
DetallePedido.belongsTo(Pedido, { foreignKey: 'idPedido' });

Producto.hasMany(DetallePedido, { foreignKey: 'idProducto', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
DetallePedido.belongsTo(Producto, { foreignKey: 'idProducto' });

Pedido.hasMany(Pago, { foreignKey: 'idPedido', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Pago.belongsTo(Pedido, { foreignKey: 'idPedido' });

Pedido.hasOne(Envio, { foreignKey: 'idPedido', onDelete: 'RESTRICT', onUpdate: 'CASCADE' });
Envio.belongsTo(Pedido, { foreignKey: 'idPedido' });

export {
    Rol, Usuario, Cliente, Domicilio, Marca, Categoria,
    Producto, ProductoCategoria, Calificacion, Carrito,
    CarritoItem, Pedido, DetallePedido, Pago, Envio
};

