// src/models/Categoria.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Categoria = sequelize.define('Categoria', {
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
    descripcion: {
        type: DataTypes.STRING,
    }
}, {
    tableName: 'categorias',
    timestamps: false,
});

export default Categoria;
