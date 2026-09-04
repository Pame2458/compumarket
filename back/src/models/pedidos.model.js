// src/model/Pedido.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pedido = sequelize.define('Pedido', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('pendiente', 'procesando', 'completado', 'cancelado'),
        defaultValue: 'pendiente',
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'pedidos',
    timestamps: false,
});

export default Pedido;
