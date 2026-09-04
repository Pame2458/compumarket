// src/models/Envio.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Envio = sequelize.define('Envio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idPedido: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Relación estricta 1:1 con Pedido
    },
    estadoEnvio: {
        type: DataTypes.ENUM('pendiente', 'embalado', 'etiquetado', 'enviado', 'entregado'),
        defaultValue: 'pendiente',
    },
    numeroGuiaSeguimiento: {
        type: DataTypes.STRING,
    },
    direccionEntregaHistorica: {
        type: DataTypes.JSON,
        allowNull: false, // Almacena el Snapshot inmutable del domicilio
    }
}, {
    tableName: 'envios',
    timestamps: false,
});

export default Envio;
