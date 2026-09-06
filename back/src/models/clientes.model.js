import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { encriptarPassword } from '../utils/auth.js';

const Cliente = sequelize.define('Cliente', {
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
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'clientes',
    timestamps: false,
  hooks: {
    beforeCreate: async (cliente) => {
        if (cliente.password) {
            cliente.password = await encriptarPassword(cliente.password);
        }
    },
    beforeUpdate: async (cliente) => {
        if (cliente.changed('password')) {
            cliente.password = await encriptarPassword(cliente.password);
        }
    },
},
});

export default Cliente;
