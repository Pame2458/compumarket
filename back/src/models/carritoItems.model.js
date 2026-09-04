// src/model/CarritoItem.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CarritoItem = sequelize.define('CarritoItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCarrito: {
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
        defaultValue: 1,
    }
}, {
    tableName: 'carrito_items',
    timestamps: false,
    indexes: [{ unique: true, fields: ['idCarrito', 'idProducto'] }]
});

export default CarritoItem;
