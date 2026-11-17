// models/domicilios.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Domicilio = sequelize.define('Domicilio', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    calle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numero: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ciudad: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departamento: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    piso: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
    },
    codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: 'domicilios',
    timestamps: true, // createdAt y updatedAt (la tabla ya las tiene)
});

export default Domicilio;