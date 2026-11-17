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
    },
    // Moderación del comentario: las estrellas siempre cuentan, el texto solo se muestra si está aprobado.
    estado: {
        type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
        allowNull: false,
        defaultValue: 'pendiente',
    },
    // Motivo que elige el admin al rechazar (ofensivo, spam, no relacionado).
    motivoRechazo: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'calificaciones',
    timestamps: false,
});

export default Calificacion;


