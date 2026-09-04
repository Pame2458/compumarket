import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Marca = sequelize.define('Marca', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo',
    }
}, {
    tableName: 'marcas',
    timestamps: false,
});

export default Marca;
