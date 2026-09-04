// src/models/detallePedido.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const DetallePedido = sequelize.define('DetallePedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    precioUnitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Inmoviliza el precio exacto del catálogo al comprar
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'detalle_pedidos',
    timestamps: false,
});

export default DetallePedido;
