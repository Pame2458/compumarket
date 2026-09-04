// src/model/Pago.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Pago = sequelize.define('Pago', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    metodoPago: {
        type: DataTypes.ENUM('tarjeta', 'mercadoPago', 'stripe', 'paypal'),
        allowNull: false,
    },
    estadoPago: {
        type: DataTypes.ENUM('pendiente', 'realizado', 'fallido', 'reembolsado'),
        defaultValue: 'pendiente',
    },
    transaccionPasarelaId: {
        type: DataTypes.STRING,
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    }
}, {
    tableName: 'pagos',
    timestamps: true, // Requerido para registrar marcas de tiempo bancarias de la pasarela
});

export default Pago;
