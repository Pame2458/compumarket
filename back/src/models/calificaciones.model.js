import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Calificacion = sequelize.define('Calificacion', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    idProducto: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    puntaje: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 5 }
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'calificaciones',
    timestamps: false,
});

export default Calificacion;



