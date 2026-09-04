
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Carrito = sequelize.define('Carrito', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    nombreCarrito: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Mi Carrito Principal',
    },
    estado: {
        type: DataTypes.ENUM('activo_actual', 'guardado', 'comprado', 'abandonado'),
        defaultValue: 'activo_actual',
    }
}, {
    tableName: 'carritos',
    timestamps: false,
});

export default Carrito;
