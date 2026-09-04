import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Producto = sequelize.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idMarca: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
        }
    },
    imagen: {
        type: DataTypes.TEXT,
    },
    peso: {
        type: DataTypes.INTEGER,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo', 'agotado', 'descontinuado'),
        defaultValue: 'activo',
    }
}, {
    tableName: 'productos',
    timestamps: false,
});

export default Producto;