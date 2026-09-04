import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Usuario = sequelize.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
    },
    direccion: {
        type: DataTypes.STRING,
    },
    rolId: {
        type: DataTypes.INTEGER,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
    beforeCreate: async (usuario) => {
        if (usuario.password) {
            usuario.password = await encriptarPassword(usuario.password);
        }
    },
    beforeUpdate: async (usuario) => {
        if (usuario.changed('password')) {
            usuario.password = await encriptarPassword(usuario.password);
        }
    },
},
});

export default Usuario;


