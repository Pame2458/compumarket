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
    // La columna sigue siendo TEXT, pero el valor se maneja como una lista de imágenes:
    // - set: guarda el array como texto JSON, por ejemplo '["/uploads/productos/1.jpg","/uploads/productos/2.jpg"]'
    // - get: siempre devuelve un array. Los productos viejos con una URL suelta
    //   (texto que no es JSON) se devuelven como un array de un solo elemento.
    imagen: {
        type: DataTypes.TEXT,
        get() {
            const raw = this.getDataValue('imagen');
            if (!raw) return [];
            try {
                const parsed = JSON.parse(raw);
                return Array.isArray(parsed) ? parsed : [raw];
            } catch {
                return [raw];
            }
        },
        set(value) {
            if (value === undefined || value === null || value === '') {
                this.setDataValue('imagen', null);
                return;
            }
            const lista = Array.isArray(value) ? value : [value];
            this.setDataValue('imagen', JSON.stringify(lista));
        },
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