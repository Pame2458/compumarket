import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProductoCategoria = sequelize.define('ProductoCategoria', {
    idProducto: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    idCategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    }
}, {
    tableName: 'producto_categoria',
    timestamps: false,
});

export default ProductoCategoria;
